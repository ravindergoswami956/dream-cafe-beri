import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ALL_MENU_ITEMS, CAFE_INFO } from '../data/menuData';
import type { MenuItem } from '../data/menuData';
import { SITE_CONFIG } from '../config/siteConfig';

const defaultUrl = 'https://ifefnhepveusdfoqlrwe.supabase.co';

export const getSupabaseConfig = () => {
  const envUrl =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
    '';
  const envAnonKey =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_KEY) ||
    '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('dream_cafe_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('dream_cafe_supabase_key') : null;

  const url = (localUrl || envUrl || defaultUrl).trim();
  const rawKey = (localKey || envAnonKey || '').trim();

  // Security Check: service_role secret keys must NEVER be used in the client
  const isServiceRole = rawKey.startsWith('sb_secret_') || rawKey.toLowerCase().includes('service_role');
  const isConfigured = Boolean(url && rawKey && rawKey.length > 20 && !isServiceRole);

  return { url, key: rawKey, isConfigured, isServiceRole };
};

export const createDynamicSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  return createClient(url, key);
};

export let supabase = createDynamicSupabaseClient();

export const refreshSupabaseClient = () => {
  supabase = createDynamicSupabaseClient();
  return supabase;
};

export const isSupabaseConfigured = () => {
  return getSupabaseConfig().isConfigured;
};

export const setSupabaseAnonKey = (key: string, url?: string) => {
  if (typeof window !== 'undefined') {
    if (key) localStorage.setItem('dream_cafe_supabase_key', key.trim());
    if (url) localStorage.setItem('dream_cafe_supabase_url', url.trim());
  }
  return refreshSupabaseClient();
};

export const clearSupabaseCustomConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('dream_cafe_supabase_key');
    localStorage.removeItem('dream_cafe_supabase_url');
  }
  return refreshSupabaseClient();
};

const STORAGE_KEY_MENU = 'dream_cafe_menu_items_v2';
const STORAGE_KEY_SETTINGS = 'dream_cafe_settings_v2';
const STORAGE_KEY_SESSION = 'dream_cafe_owner_session_v2';

export interface CafeSettings {
  brandName: string;
  openingHours: string;
  phone: string;
  address: string;
  mapsUrl: string;
}

// ------------------------------------------------------------------
// Connection Test Function
// ------------------------------------------------------------------

export async function testSupabaseConnection(overrideKey?: string): Promise<{
  success: boolean;
  message: string;
  itemCount?: number;
}> {
  const { url, key } = getSupabaseConfig();
  const testKey = overrideKey || key;

  if (!testKey || testKey.length < 20) {
    return {
      success: false,
      message: 'Supabase `anon` public key is missing or incomplete.',
    };
  }

  try {
    const testClient = createClient(url, testKey);
    const { data, error, count } = await testClient
      .from('menu_items')
      .select('id', { count: 'exact' })
      .limit(1);

    if (error) {
      return {
        success: false,
        message: `Supabase Error: ${error.message} (Code: ${error.code})`,
      };
    }

    return {
      success: true,
      message: `Connected successfully to project! Database tables active.`,
      itemCount: count ?? data?.length ?? 0,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

// ------------------------------------------------------------------
// Menu Items Management
// ------------------------------------------------------------------

export async function getMenuItems(): Promise<MenuItem[]> {
  const client = supabase || createDynamicSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as MenuItem[];
      }
    } catch (err) {
      console.warn('Falling back to local storage:', err);
    }
  }

  // Local Storage fallback & seed
  const stored = localStorage.getItem(STORAGE_KEY_MENU);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse local menu data:', e);
    }
  }

  // Seed default menu
  localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(ALL_MENU_ITEMS));
  return ALL_MENU_ITEMS;
}

export async function saveMenuItem(item: MenuItem): Promise<{ success: boolean; error?: string }> {
  // Local storage save
  const currentItems = await getMenuItems();
  const index = currentItems.findIndex((i) => i.id === item.id);
  let updatedItems: MenuItem[];

  if (index >= 0) {
    updatedItems = [...currentItems];
    updatedItems[index] = item;
  } else {
    updatedItems = [item, ...currentItems];
  }

  localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updatedItems));

  // Sync to Supabase if available
  const client = supabase || createDynamicSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('menu_items').upsert({
        ...item,
        updated_at: new Date().toISOString(),
      });
      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  return { success: true };
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; error?: string }> {
  const currentItems = await getMenuItems();
  const updatedItems = currentItems.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updatedItems));

  const client = supabase || createDynamicSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('menu_items').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  return { success: true };
}

// ------------------------------------------------------------------
// Cafe Settings Management
// ------------------------------------------------------------------

export async function getCafeSettings(): Promise<CafeSettings> {
  const client = supabase || createDynamicSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('cafe_settings')
        .select('*')
        .eq('id', 'primary')
        .single();

      if (!error && data) {
        return {
          brandName: data.brand_name || CAFE_INFO.name,
          openingHours: data.opening_hours || CAFE_INFO.openingHours,
          phone: data.phone || CAFE_INFO.phone,
          address: data.address || CAFE_INFO.address,
          mapsUrl: data.maps_url || CAFE_INFO.mapsUrl,
        };
      }
    } catch (err) {
      console.warn('Falling back to local cafe settings:', err);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Ignore parse failure and fall through
    }
  }

  const defaults: CafeSettings = {
    brandName: CAFE_INFO.name,
    openingHours: CAFE_INFO.openingHours,
    phone: CAFE_INFO.phone,
    address: CAFE_INFO.address,
    mapsUrl: CAFE_INFO.mapsUrl,
  };

  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaults));
  return defaults;
}

export async function saveCafeSettings(settings: CafeSettings): Promise<{ success: boolean; error?: string }> {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));

  const client = supabase || createDynamicSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('cafe_settings').upsert({
        id: 'primary',
        brand_name: settings.brandName,
        opening_hours: settings.openingHours,
        phone: settings.phone,
        address: settings.address,
        maps_url: settings.mapsUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) return { success: false, error: error.message };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  return { success: true };
}

// ------------------------------------------------------------------
// Security & Owner Authentication
// ------------------------------------------------------------------

export interface OwnerSession {
  email: string;
  role: 'owner';
  authenticatedAt: string;
  token?: string;
}

export function getOwnerSession(): OwnerSession | null {
  const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
  if (!sessionStr) return null;
  try {
    const session = JSON.parse(sessionStr);
    const authTime = new Date(session.authenticatedAt).getTime();
    if (Date.now() - authTime > 24 * 60 * 60 * 1000) {
      logoutOwner();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function logoutOwner(): void {
  localStorage.removeItem(STORAGE_KEY_SESSION);
  const client = supabase || createDynamicSupabaseClient();
  if (client) {
    client.auth.signOut().catch(() => {});
  }
}

export async function isEmailAuthorizedOwner(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();

  const matchesConfig = SITE_CONFIG.authorizedOwnerEmails.some(
    (e) => e.toLowerCase() === normalized
  );

  const client = supabase || createDynamicSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('admin_users')
        .select('role')
        .eq('email', normalized)
        .maybeSingle();

      if (!error && data && data.role === 'owner') {
        return true;
      }
    } catch (e) {
      console.warn('Supabase admin check error:', e);
    }
  }

  return matchesConfig;
}

export const getAdminMasterPassword = (): string => {
  const envPass = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ADMIN_PASSWORD) || '';
  return envPass || 'Dream77#!';
};

export async function loginOwnerWithPassword(
  email: string,
  password: string
): Promise<{ success: boolean; session?: OwnerSession; error?: string }> {
  const trimmedPassword = password.trim();

  if (!trimmedPassword) {
    return { success: false, error: 'Please enter the admin password.' };
  }

  // Support Dream77#! (with or without quotes, or configured in env)
  const isMatch =
    trimmedPassword === 'Dream77#!' ||
    trimmedPassword === '"Dream77#!"' ||
    trimmedPassword === getAdminMasterPassword();

  if (!isMatch) {
    return {
      success: false,
      error: 'Incorrect admin password. Please try again.',
    };
  }

  const normalized = (email || 'cafe47516@gmail.com').trim().toLowerCase();
  const targetEmail = normalized.includes('@') ? normalized : 'cafe47516@gmail.com';

  // Establish verified owner session
  const session: OwnerSession = {
    email: targetEmail,
    role: 'owner',
    authenticatedAt: new Date().toISOString(),
  };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  }

  return { success: true, session };
}

export async function requestOwnerOtp(email: string): Promise<{ success: boolean; message: string }> {
  const normalized = email.trim().toLowerCase();

  // 1. Verify owner authorization against whitelist & database
  const authorized = await isEmailAuthorizedOwner(normalized);
  if (!authorized) {
    return {
      success: false,
      message: `Access Denied: The email "${email}" is not registered as an authorized owner administrator.`,
    };
  }

  // 2. Ensure real Supabase Auth provider is configured
  const cfg = getSupabaseConfig();
  if (cfg.isServiceRole) {
    return {
      success: false,
      message:
        'Security Alert: A secret service_role key was detected. Only public anon or publishable keys (sb_publishable_... or eyJhb...) are permitted on the frontend.',
    };
  }

  const client = supabase || createDynamicSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      message:
        'Supabase Auth Not Configured: Missing public API key. Real OTP email dispatch to ' +
        normalized +
        ' requires VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in your .env file or Owner Portal settings.',
    };
  }

  // 3. Dispatch genuine OTP via Supabase Auth
  try {
    const { error } = await client.auth.signInWithOtp({
      email: normalized,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined,
      },
    });

    if (error) {
      return {
        success: false,
        message: `Supabase Auth Error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalized}. Please check your inbox and spam folder.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: `Request failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function verifyOwnerOtp(
  email: string,
  code: string
): Promise<{ success: boolean; session?: OwnerSession; error?: string }> {
  const normalized = email.trim().toLowerCase();
  const trimmedToken = code.trim();

  if (!trimmedToken) {
    return { success: false, error: 'Please enter the verification code.' };
  }

  // 1. Pre-validation of authorization
  const authorized = await isEmailAuthorizedOwner(normalized);
  if (!authorized) {
    return { success: false, error: `Access Denied: "${email}" is not an authorized owner.` };
  }

  // 2. Ensure Supabase Auth provider is configured
  const client = supabase || createDynamicSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Authentication Incomplete: Supabase anon key is missing. Cannot verify token without provider connection.',
    };
  }

  // 3. Verify OTP code with Supabase Auth
  try {
    const { data, error } = await client.auth.verifyOtp({
      email: normalized,
      token: trimmedToken,
      type: 'email',
    });

    if (error || !data.session) {
      return {
        success: false,
        error: error?.message || 'Invalid or expired verification code. Please request a fresh code.',
      };
    }

    // 4. Strict Backend Role Check: Email verification alone NEVER grants admin access
    const { data: adminRecord, error: adminError } = await client
      .from('admin_users')
      .select('role')
      .eq('email', normalized)
      .maybeSingle();

    const isExplicitOwner =
      (!adminError && adminRecord && (adminRecord.role === 'owner' || adminRecord.role === 'manager')) ||
      SITE_CONFIG.authorizedOwnerEmails.some((e) => e.toLowerCase() === normalized);

    if (!isExplicitOwner) {
      await client.auth.signOut().catch(() => {});
      return {
        success: false,
        error: 'Security Authorization Denied: Verified user does not possess owner administrator privileges in database.',
      };
    }

    const session: OwnerSession = {
      email: normalized,
      role: 'owner',
      authenticatedAt: new Date().toISOString(),
      token: data.session.access_token,
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    }

    return { success: true, session };
  } catch (err: unknown) {
    return {
      success: false,
      error: `Verification error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
