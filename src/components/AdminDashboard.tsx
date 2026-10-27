import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Clock,
  Save,
  LogOut,
  ExternalLink,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  Utensils,
  Database,
  Key,
  RefreshCw,
} from 'lucide-react';
import {
  getMenuItems,
  saveMenuItem,
  deleteMenuItem,
  getCafeSettings,
  saveCafeSettings,
  logoutOwner,
  getSupabaseConfig,
  testSupabaseConnection,
  refreshSupabaseClient,
  isSupabaseConfigured,
} from '../lib/supabase';
import type { CafeSettings, OwnerSession } from '../lib/supabase';
import { CATEGORIES } from '../data/menuData';
import type { MenuItem } from '../data/menuData';

interface AdminDashboardProps {
  session: OwnerSession;
  onLogout: () => void;
  onViewLiveSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  session,
  onLogout,
  onViewLiveSite,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<CafeSettings>({
    brandName: '',
    openingHours: '',
    phone: '',
    address: '',
    mapsUrl: '',
  });
  const [activeTab, setActiveTab] = useState<'menu' | 'settings' | 'supabase'>('menu');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Supabase Configuration State
  const initialConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(initialConfig.key);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
    loading?: boolean;
  }>({ tested: false });

  // Edit / Create Modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('pizzas');
  const [formPrice, setFormPrice] = useState('Ask for price');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formSpicy, setFormSpicy] = useState(false);
  const [formPopular, setFormPopular] = useState(false);
  const [formVegetarian, setFormVegetarian] = useState(true);

  // Notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const notify = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadData = async () => {
    const items = await getMenuItems();
    setMenuItems(items);
    const setts = await getCafeSettings();
    setSettings(setts);
  };

  useEffect(() => {
    loadData();
    // Auto test connection on mount if key exists
    if (initialConfig.key && initialConfig.key.length > 20) {
      testSupabaseConnection().then((res) => {
        setTestResult({
          tested: true,
          success: res.success,
          message: res.message,
        });
      });
    }
  }, []);

  const handleTestConnection = async () => {
    setTestResult({ tested: false, loading: true });
    const res = await testSupabaseConnection(supabaseKey.trim());
    setTestResult({
      tested: true,
      success: res.success,
      message: res.message,
      loading: false,
    });

    if (res.success) {
      localStorage.setItem('dream_cafe_supabase_url', supabaseUrl.trim());
      localStorage.setItem('dream_cafe_supabase_key', supabaseKey.trim());
      refreshSupabaseClient();
      notify('success', 'Supabase connected! Sync active.');
      loadData();
    } else {
      notify('error', res.message);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('pizzas');
    setFormPrice('Ask for price');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80');
    setFormBadge('');
    setFormSpicy(false);
    setFormPopular(false);
    setFormVegetarian(true);
    setIsItemModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.badge === 'Ask for price' ? 'Ask for price' : (item as any).price || 'Ask for price');
    setFormDescription(item.description);
    setFormImage(item.image);
    setFormBadge(item.badge || '');
    setFormSpicy(Boolean(item.spicy));
    setFormPopular(Boolean(item.popular));
    setFormVegetarian(Boolean(item.vegetarian));
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem ? editingItem.id : `item-${Date.now()}`;
    const newItem: MenuItem = {
      id,
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      image: formImage.trim() || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      badge: formBadge.trim() || undefined,
      spicy: formSpicy,
      popular: formPopular,
      vegetarian: formVegetarian,
      ...({ price: formPrice.trim() || 'Ask for price' } as any),
    };

    const res = await saveMenuItem(newItem);
    if (res.success) {
      notify('success', `Item "${formName}" saved successfully.`);
      setIsItemModalOpen(false);
      loadData();
    } else {
      notify('error', res.error || 'Failed to save item.');
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      const res = await deleteMenuItem(id);
      if (res.success) {
        notify('success', `Deleted "${name}".`);
        loadData();
      } else {
        notify('error', res.error || 'Failed to delete item.');
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveCafeSettings(settings);
    if (res.success) {
      notify('success', 'Cafe settings updated and published permanently.');
    } else {
      notify('error', res.error || 'Failed to save settings.');
    }
  };

  const filteredItems = menuItems.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-[#0E0C0A] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#16120E]/95 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center font-bold text-black shadow">
            ☕
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wide text-white flex items-center gap-2">
              Dream Cafe Dashboard
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                Owner Mode
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">
              Authenticated as: <span className="text-amber-300 font-mono">{session.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewLiveSite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-semibold border border-white/10 transition"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              logoutOwner();
              onLogout();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-semibold border border-red-500/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border animate-in slide-in-from-bottom-4 ${
              notification.type === 'success'
                ? 'bg-[#182618] border-green-500/50 text-green-200'
                : 'bg-[#2A1414] border-red-500/50 text-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>{notification.text}</span>
          </div>
        )}

        {/* Database Connectivity Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-[#14120F] border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                testResult.success
                  ? 'bg-green-500 animate-pulse'
                  : isSupabaseConfigured()
                  ? 'bg-amber-400'
                  : 'bg-orange-400'
              }`}
            />
            <span>
              <strong>Backend Status:</strong>{' '}
              {testResult.success ? (
                <span className="text-green-300 font-semibold">
                  Live Supabase Cloud Connected (Project: ifefnhepveusdfoqlrwe)
                </span>
              ) : (
                <span className="text-amber-300">
                  Supabase Project URL configured. Awaiting `anon` key to activate live sync.
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('supabase')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Configure Connection →
            </button>
            <span className="text-white/20">|</span>
            <span className="text-amber-400 font-semibold">{menuItems.length} Total Menu Items</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu Manager</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Opening Hours & Contact</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Cloud Sync</span>
          </button>
        </div>

        {/* Tab 1: Menu Manager */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Search, Filter & Add Item */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-1 gap-2 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search menu to edit..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181512] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="py-2.5 px-3 rounded-xl bg-[#181512] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            {/* Menu Items Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#14120F] border border-white/10 rounded-2xl p-4 flex gap-3.5 items-start justify-between shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-neutral-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold text-amber-400 uppercase">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          {item.badge}
                        </span>
                      )}
                      {item.spicy && <span className="text-[10px]">🌶️</span>}
                    </div>
                    <h3 className="text-sm font-bold text-white truncate mt-0.5">{item.name}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{item.description}</p>
                    <div className="text-xs font-bold text-amber-300 mt-1">
                      {(item as any).price || 'Ask for price'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Settings & Hours */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-[#14120F] border border-white/10 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Cafe Information & Timings
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Update your opening hours, phone number, and address displayed to customers in real time.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Opening Information
                </label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                  placeholder="e.g. Opens daily at 10:00 AM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Phone Number (Click to Call)
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Google Maps Link
                </label>
                <input
                  type="text"
                  value={settings.mapsUrl}
                  onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition"
                >
                  <Save className="w-4 h-4" />
                  Save & Publish Live
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Supabase Cloud Database Configuration */}
        {activeTab === 'supabase' && (
          <div className="max-w-2xl bg-[#14120F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                <Database className="w-5 h-5 text-amber-400" />
                Supabase Cloud Database Connection
              </h2>
              <p className="text-xs text-neutral-400">
                Connect your PostgreSQL database hosted on Supabase to enable real-time synchronization and permanent cloud storage.
              </p>
            </div>

            {/* Status Feedback Box */}
            {testResult.tested && (
              <div
                className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                  testResult.success
                    ? 'bg-green-950/40 border-green-500/40 text-green-200'
                    : 'bg-red-950/40 border-red-500/40 text-red-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold mb-0.5">
                    {testResult.success ? 'Connected Successfully!' : 'Connection Check Failed'}
                  </div>
                  <div className="leading-relaxed opacity-90">{testResult.message}</div>
                </div>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Supabase Anon / Public Key</span>
                  <a
                    href="https://supabase.com/dashboard/project/ifefnhepveusdfoqlrwe/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline normal-case text-[11px] font-normal"
                  >
                    Get anon key from Supabase Dashboard ↗
                  </a>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
                  💡 Found in your Supabase project under <strong>Project Settings → API → `anon` public key</strong>.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={testResult.loading}
                  onClick={handleTestConnection}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${testResult.loading ? 'animate-spin' : ''}`} />
                  <span>{testResult.loading ? 'Testing...' : 'Test & Save Connection'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      {isItemModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setIsItemModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#14120F] border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsItemModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full bg-white/5 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem ? `Edit: ${editingItem.name}` : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Volcano Paneer Pizza"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Price (e.g. ₹150 or Ask)</label>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. ₹180 or Ask for price"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Appetizing description of ingredients and taste..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Special Badge (Optional)</label>
                <input
                  type="text"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="e.g. Best Seller, Chef Choice, Super Crunch"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSpicy}
                    onChange={(e) => setFormSpicy(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>🌶️ Spicy</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPopular}
                    onChange={(e) => setFormPopular(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>⭐ Popular</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVegetarian}
                    onChange={(e) => setFormVegetarian(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>🌱 100% Veg</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold uppercase tracking-wider"
                >
                  {editingItem ? 'Save Updates' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
