-- ==============================================================================
-- DREAM CAFE BERI - SUPABASE DATABASE SCHEMA & INITIAL SEED
-- Project ID: ifefnhepveusdfoqlrwe
-- Copy and paste this entire code into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ifefnhepveusdfoqlrwe/sql
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Authorized Admins Table (Whitelist)
-- CRITICAL SECURITY: Email verification alone NEVER grants admin permissions.
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'manager')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security helper function: checks if active session belongs to authorized admin
CREATE OR REPLACE FUNCTION public.is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE (user_id = auth.uid() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins can view the admin table
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;
CREATE POLICY "Admins can view admin list"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (public.is_authorized_admin());

-- 3. Create Cafe Settings Table
CREATE TABLE IF NOT EXISTS public.cafe_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    brand_name TEXT NOT NULL DEFAULT 'Dream Cafe',
    opening_hours TEXT NOT NULL DEFAULT 'Opens daily at 10:00 AM',
    phone TEXT NOT NULL DEFAULT '+91 82782 33573',
    address TEXT NOT NULL DEFAULT 'Lala Ram Sarup Memorial Park, near Goswami Electronics, Beri, Haryana 124201, India',
    maps_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.cafe_settings ENABLE ROW LEVEL SECURITY;

-- Public read access: visitors do NOT need to log in to read cafe info
DROP POLICY IF EXISTS "Public read cafe settings" ON public.cafe_settings;
CREATE POLICY "Public read cafe settings"
    ON public.cafe_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only authorized admin can update cafe info
DROP POLICY IF EXISTS "Authorized admins update cafe settings" ON public.cafe_settings;
CREATE POLICY "Authorized admins update cafe settings"
    ON public.cafe_settings
    FOR UPDATE
    TO authenticated
    USING (public.is_authorized_admin())
    WITH CHECK (public.is_authorized_admin());

-- Seed default settings
INSERT INTO public.cafe_settings (id, brand_name, opening_hours, phone, address, maps_url)
VALUES (
    'primary',
    'Dream Cafe',
    'Opens daily at 10:00 AM',
    '+91 82782 33573',
    'Lala Ram Sarup Memorial Park, near Goswami Electronics, Beri, Haryana 124201, India',
    'https://maps.google.com/?q=Lala+Ram+Sarup+Memorial+Park,+near+Goswami+Electronics,+Beri,+Haryana+124201,+India'
)
ON CONFLICT (id) DO UPDATE SET
    brand_name = EXCLUDED.brand_name,
    opening_hours = EXCLUDED.opening_hours,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    maps_url = EXCLUDED.maps_url;

-- 4. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT DEFAULT 'Ask for price',
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    badge TEXT,
    spicy BOOLEAN DEFAULT false,
    popular BOOLEAN DEFAULT false,
    vegetarian BOOLEAN DEFAULT true,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Public can view all menu items without login
DROP POLICY IF EXISTS "Public can view active menu items" ON public.menu_items;
CREATE POLICY "Public can view active menu items"
    ON public.menu_items
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only authorized admin can insert, update, or delete
DROP POLICY IF EXISTS "Admins can insert menu items" ON public.menu_items;
CREATE POLICY "Admins can insert menu items"
    ON public.menu_items
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins can update menu items" ON public.menu_items;
CREATE POLICY "Admins can update menu items"
    ON public.menu_items
    FOR UPDATE
    TO authenticated
    USING (public.is_authorized_admin())
    WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins can delete menu items" ON public.menu_items;
CREATE POLICY "Admins can delete menu items"
    ON public.menu_items
    FOR DELETE
    TO authenticated
    USING (public.is_authorized_admin());

-- 5. Seed Initial Menu Items
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sw-1', 'Pasta Sandwich', 'sandwiches', 'Ask for price', 'Creamy cheesy pasta layered generously between butter-toasted artisan bread slices.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sw-2', 'Corn Burst Sandwich', 'sandwiches', 'Ask for price', 'Sweet golden corn kernels tossed with spiced herbs and molten cheese grilled to perfection.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sw-3', 'Mix Veg Sandwich', 'sandwiches', 'Ask for price', 'Crunchy farm-fresh vegetables, secret house seasoning, and melted cheese spread.', 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sw-4', 'Paneer Lover Sandwich', 'sandwiches', 'Ask for price', 'Soft marinated cottage cheese cubes with bell peppers and luscious spicy sauces.', 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=800&q=80', 'Chef Choice', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sw-5', 'Makhani Sandwich', 'sandwiches', 'Ask for price', 'Rich royal butter makhani gravy infused with diced veggies and paneer in crisp bread.', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sw-6', 'Tandoori Sandwich', 'sandwiches', 'Ask for price', 'Smoky tandoori spiced marinade, fresh crunchy onions, and melted cheese toasted golden.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sw-7', 'Healthy Sandwich', 'sandwiches', 'Ask for price', 'Fresh crisp garden veggies, cucumbers, tomatoes, and light herb dressing for a guilt-free bite.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('bg-1', 'Veg Burger', 'burgers', 'Ask for price', 'Classic crisp vegetable patty with fresh lettuce, sliced tomatoes, and creamy dressing.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('bg-2', 'Aloo Tikki Burger', 'burgers', 'Ask for price', 'Golden spiced potato patty seasoned with North Indian spices, crunchy onions, and tangy mayo.', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('bg-3', 'Hangover Burger', 'burgers', 'Ask for price', 'Double stacked crunch patty overloaded with melting cheese slices, jalapenos, and spicy drizzle.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 'Legendary', true, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('bg-4', 'Masala Burger', 'burgers', 'Ask for price', 'Desi spiced seasoned patty topped with zesty mint sauce, fresh rings, and warm brioche bun.', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('bg-5', 'Spicy Veggie Burger', 'burgers', 'Ask for price', 'Extra fiery vegetable patty with peri peri seasoning and hot chilli dip.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('bg-6', 'Paneer Burger', 'burgers', 'Ask for price', 'Thick marinated cottage cheese steak crumb-fried to a golden crunch with special house sauce.', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('bg-7', 'Love Bite Burger', 'burgers', 'Ask for price', 'Sweet and tangy secret sauce recipe pairing soft bun with melting cheese and crunchy filling.', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80', 'Dream Special', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('bg-8', 'Special Burger', 'burgers', 'Ask for price', 'The Dream Cafe signature masterpiece: double patty, double cheese, and chef secret spice blend.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 'House Signature', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('wr-1', 'Aloo Tikki Wrap', 'wraps', 'Ask for price', 'Crisp seasoned potato patty rolled with onion slices and signature mint mayonnaise in tortilla.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('wr-2', 'Masala Wrap', 'wraps', 'Ask for price', 'Warm tortilla roll loaded with aromatic spiced veggie filling and zesty tangy chutney.', 'https://images.unsplash.com/photo-1644364935906-8964d84b00c3?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('wr-3', 'Crispy Veggie Wrap', 'wraps', 'Ask for price', 'Golden fried vegetable nuggets with shredded cabbage, tomatoes, and garlic mayo wrap.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('wr-4', 'Salsa Paneer Wrap', 'wraps', 'Ask for price', 'Juicy paneer chunks tossed in tangy Mexican tomato salsa and melted cheese.', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80', 'Popular', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('wr-5', 'Special Wrap', 'wraps', 'Ask for price', 'The ultimate loaded wrap with paneer, crisp veggies, double cheese, and house secret dressing.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', 'House Signature', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pa-1', 'White Sauce Pasta', 'pasta', 'Ask for price', 'Classic velvety Alfredo cream sauce tossed with penne, sweet corn, bell peppers, and oregano.', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80', 'Best Seller', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pa-2', 'Red Sauce Pasta', 'pasta', 'Ask for price', 'Tangy and spicy Italian pomodoro arrabbiata sauce with garlic, herbs, and tender pasta.', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pa-3', 'Makhani Pasta', 'pasta', 'Ask for price', 'A rich culinary fusion of creamy Indian butter makhani gravy with Italian penne and cheese.', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', 'Fusion Special', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pa-4', 'Tandoori Sauce Pasta', 'pasta', 'Ask for price', 'Smoky tandoori seasoning blended into velvety cheese sauce with sauteed onions and capsicum.', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pa-5', 'Mix Sauce Pasta', 'pasta', 'Ask for price', 'The perfect pink harmony of rich white Alfredo and zesty red sauce loaded with mozzarella.', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('fr-1', 'Classic Fries', 'fries', 'Ask for price', 'Golden salted French fries, fried to crisp perfection on the outside and fluffy inside.', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('fr-2', 'Peri Peri Fries', 'fries', 'Ask for price', 'Hot crisp fries tossed in an aromatic, fiery African bird eye chili peri peri seasoning.', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80', NULL, true, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('fr-3', 'Peri Peri Cheese Fries', 'fries', 'Ask for price', 'Fiery peri peri fries smothered under a lavish pour of warm melted cheddar cheese.', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80', 'Crowd Favorite', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('fr-4', 'Cheese Burst Fries', 'fries', 'Ask for price', 'Overflowing cheese explosion coating golden crisp fries with herb sprinkle.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', 'Cheesy', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('fr-5', 'Mexican Fries', 'fries', 'Ask for price', 'Fries seasoned with Mexican spices, jalapeno bites, and tangy salsa cream drizzle.', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-1', 'Cheese Margherita', 'pizzas', 'Ask for price', 'Classic 100% mozzarella cheese blend with aromatic Italian basil herbs on hand-tossed crust.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', 'Classic', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-2', 'Volcano Pizza', 'pizzas', 'Ask for price', 'Our showstopper center-burst volcano crust loaded with bubbling cheese and hot toppings.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 'House Signature', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-3', 'Paneer Tikka Pizza', 'pizzas', 'Ask for price', 'Clay-oven style tandoori paneer cubes, crisp capsicum, onion rings, and spicy drizzle.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', 'Best Seller', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-4', 'Farmhouse Pizza', 'pizzas', 'Ask for price', 'A delightful harvest of crisp bell peppers, sweet golden corn, mushrooms, and fresh onions.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-5', 'Special Loaded Pizza', 'pizzas', 'Ask for price', 'Loaded to the edge with paneer, olives, jalapenos, sweet corn, mushrooms, and double mozzarella.', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80', 'Premium', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-6', 'Tandoori Paneer Pizza', 'pizzas', 'Ask for price', 'Paneer marinated in robust tandoori masala with green capsicum and melted mozzarella.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-7', 'Makhani Paneer Pizza', 'pizzas', 'Ask for price', 'Rich velvety makhani sauce base topped with marinated paneer and buttery herbs.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-8', 'Hot N Spicy Pizza', 'pizzas', 'Ask for price', 'Red paprika, fiery jalapenos, spicy red chilli flakes, and tangy tomato sauce.', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-9', 'Onion Pizza', 'pizzas', 'Ask for price', 'Crisp crunchy caramelized onions over tangy pizza sauce and mozzarella.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-10', 'Capsicum Pizza', 'pizzas', 'Ask for price', 'Fresh green bell peppers providing crisp bite and herbal aroma on melted cheese.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-11', 'Tomato Pizza', 'pizzas', 'Ask for price', 'Juicy sliced red tomatoes baked to sweet perfection with mozzarella herbs.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-12', 'Golden Corn Pizza', 'pizzas', 'Ask for price', 'Tender sweet corn pearls scattered over golden baked mozzarella cheese.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-13', 'Cheese Olive Pizza', 'pizzas', 'Ask for price', 'Savory black Spanish olives layered on luscious stringy melted cheese.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-14', 'Cheese Jalapeno Pizza', 'pizzas', 'Ask for price', 'Zesty pickled Mexican jalapenos giving the ultimate spicy kick on cheese.', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-15', 'Red Paprika Pizza', 'pizzas', 'Ask for price', 'Vibrant sweet and spicy red paprika slices on baked mozzarella.', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-16', 'Cheese Pineapple Pizza', 'pizzas', 'Ask for price', 'Juicy tropical pineapple pieces paired with savory melted cheese.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-17', 'Green Vegetarian Pizza', 'pizzas', 'Ask for price', 'A vibrant green medley of capsicum, green chillies, and fresh coriander herbs.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-18', 'Cheese Mushroom Pizza', 'pizzas', 'Ask for price', 'Earthy sliced button mushrooms baked in cheese sauce with cracked black pepper.', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-19', 'Double Veg Pizza', 'pizzas', 'Ask for price', 'A balanced duo of crisp crunchy garden vegetables and melted mozzarella.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-20', 'Onion Paneer Pizza', 'pizzas', 'Ask for price', 'Crispy sweet onions paired with tender paneer cubes and mild spices.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-21', 'Spicy Loaded Pizza', 'pizzas', 'Ask for price', 'Loaded with jalapenos, paprika, green chillies, onions, and spicy herb oil.', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-22', 'Cheese & Corn Pizza', 'pizzas', 'Ask for price', 'Evergreen pairing of sweet corn kernels and extra stretchy cheese.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-23', 'Corn Paneer Pizza', 'pizzas', 'Ask for price', 'Sweet corn bursts mixed with creamy cottage cheese and fragrant oregano.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-24', 'Tomato Corn Pizza', 'pizzas', 'Ask for price', 'Juicy tomato slices paired with sweet golden corn and mozzarella.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-25', 'Capsicum Paneer Pizza', 'pizzas', 'Ask for price', 'Classic crunchy bell peppers paired with soft spiced paneer bites.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-26', 'Veg Queen Pizza', 'pizzas', 'Ask for price', 'A royal feast of assorted fresh veggies, olives, and premium cheese.', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80', 'Special', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-27', 'Wheat Pizza', 'pizzas', 'Ask for price', 'Wholesome stoneground whole wheat crust topped with vibrant vegetables.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-28', 'Special Pizza', 'pizzas', 'Ask for price', 'Chef signature recipe with special house crust, multi-cheese blend, and toppings.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 'Chef Special', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-29', 'Veg Treat Pizza', 'pizzas', 'Ask for price', 'Generous serving of fresh garden treats including bell peppers, corn, and onions.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-30', 'Tangy Paneer Pizza', 'pizzas', 'Ask for price', 'Paneer tossed in a zesty, tangy tomato tamarind herb reduction.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-31', 'Paneer Lover Pizza', 'pizzas', 'Ask for price', 'Overloaded with rich double marinated paneer cubes and melted cheese.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-32', 'American Veg Pizza', 'pizzas', 'Ask for price', 'American style sweet corn, crunchy red onions, bell peppers, and savory cheese.', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-33', 'Country Special Pizza', 'pizzas', 'Ask for price', 'Rustic toppings of crisp garden greens, sweet tomatoes, and aromatic seasonings.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('pz-34', 'Spicy Veg Pizza', 'pizzas', 'Ask for price', 'Finely chopped green chillies, spicy seasoning, capsicum, and onions.', 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sh-1', 'Nutella Shake', 'shakes', 'Ask for price', 'Decadent creamy blend of authentic Italian hazelnut Nutella with rich ice cream.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Popular', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sh-2', 'Oreo Caramel Shake', 'shakes', 'Ask for price', 'Crushed chocolate Oreo cookies blended with golden salted caramel drizzle.', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80', 'Must Try', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sh-3', 'Chocolate Shake', 'shakes', 'Ask for price', 'Rich dark Belgian chocolate blended thick with fresh chilled milk and ice cream.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sh-4', 'Strawberry Shake', 'shakes', 'Ask for price', 'Sweet luscious strawberry infusion whipped into a silky smooth pink delight.', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sh-5', 'Vanilla Shake', 'shakes', 'Ask for price', 'Classic aromatic Madagascar vanilla bean cream whip.', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sh-6', 'Mango Shake', 'shakes', 'Ask for price', 'Sun-ripened Alphonso mango pulp blended into an exotic tropical shake.', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sh-7', 'Blueberry Shake', 'shakes', 'Ask for price', 'Wild blueberry crush blended with chilled cream and vanilla notes.', 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sh-8', 'Black Currant Shake', 'shakes', 'Ask for price', 'Tangy and sweet black currant berries whipped to creamy indulgence.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('lm-1', 'Mint Mojito', 'lemonades', 'Ask for price', 'Fresh muddled garden mint leaves, zesty lemon juice, crushed ice, and sparkling fizz.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'Refreshing', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('lm-2', 'Green Apple', 'lemonades', 'Ask for price', 'Crisp tart green apple syrup topped with chilled sparkling soda and ice.', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('lm-3', 'Black Currant Lemonade', 'lemonades', 'Ask for price', 'Deep berry sweetness balanced with sparkling citrus lemon soda.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('lm-4', 'Blue Ice', 'lemonades', 'Ask for price', 'Vibrant blue curaçao citrus flavor with chilled soda and ice rocks.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', 'Popular', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('lm-5', 'Strawberry Lemonade', 'lemonades', 'Ask for price', 'Sweet berry syrup and freshly squeezed lime with bubbly carbonation.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cf-1', 'Cold Coffee', 'coffee', 'Ask for price', 'Signature chilled blend of roasted coffee beans, cream, and rich chocolate drizzle.', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', 'All-Time Hit', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cf-2', 'Cappuccino', 'coffee', 'Ask for price', 'Freshly pulled espresso shot topped with velvety steamed milk foam and cocoa dusting.', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cf-3', 'Strong Cold Coffee', 'coffee', 'Ask for price', 'Extra double shot espresso cold brew for coffee connoisseurs who crave an intense kick.', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cf-4', 'Light Cold Coffee', 'coffee', 'Ask for price', 'Mellow, silky smooth cold coffee with balanced milkiness and gentle sweetness.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cf-5', 'Sugar-Free Cold Coffee', 'coffee', 'Ask for price', 'Guilt-free chilled brew sweetened with zero-calorie sweetener for health-conscious coffee lovers.', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cf-6', 'Ice-Free Cold Coffee', 'coffee', 'Ask for price', 'Pure concentrated chilled coffee and thick milk without ice melting to dilute the flavor.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sd-1', 'Choco Lava', 'sides', 'Ask for price', 'Warm chocolate cake with an irresistible molten liquid chocolate center oozing on first bite.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', 'Must Have', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sd-2', 'Stuffed Garlic Bread', 'sides', 'Ask for price', 'Golden crust bread stuffed with melted mozzarella, sweet corn, and jalapeno seasoning.', 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80', 'Popular', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sd-3', 'Garlic Bread Loaded', 'sides', 'Ask for price', 'Toasted baguette slices smothered with garlic herb butter, double cheese, and roasted toppings.', 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sd-4', 'Garlic Bread Sticks', 'sides', 'Ask for price', 'Crisp oven-baked sticks infused with fragrant garlic butter and oregano dip seasoning.', 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sd-5', 'Cheese Balls', 'sides', 'Ask for price', 'Bite-sized crispy golden crumb spheres filled with molten molten cheese that stretches.', 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sd-6', 'Potato Pops', 'sides', 'Ask for price', 'Crunchy golden seasoned potato nuggets served with our signature spiced creamy dip.', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sd-7', 'Veg Salad', 'sides', 'Ask for price', 'Crisp farm greens, cucumber ribbons, cherry tomatoes, and olive herb dressing.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('sd-8', 'Special Cake', 'sides', 'Ask for price', 'Dream Cafe celebratory handcrafted dessert cake layered with silky frosting and chocolate.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 'Celebration', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mg-1', 'Plain Maggie', 'maggie', 'Ask for price', 'Classic nostalgic masala noodles simmered with original spices and warm comfort.', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mg-2', 'Cheese Maggie', 'maggie', 'Ask for price', 'Hot spicy masala noodles crowned with a thick blanket of melting cheddar and mozzarella.', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', 'Cheesy', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mg-3', 'Tandoori Maggie', 'maggie', 'Ask for price', 'Smoky tandoori seasoning, crunchy sauteed onions, and capsicum tossed with noodles.', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', NULL, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mg-4', 'Special Maggie', 'maggie', 'Ask for price', 'The Dream Cafe signature preparation loaded with mixed veggies, paneer, double cheese, and secret spices.', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80', 'House Special', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mo-1', 'Veg Kurkure Momos', 'momos', 'Ask for price', 'Extra-crunchy flake-crusted vegetable momos fried golden and served with fiery red chili sauce.', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', 'Super Crunch', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mo-2', 'Paneer Kurkure Momos', 'momos', 'Ask for price', 'Juicy spiced paneer filling wrapped in an ultra-crispy textured coating with tangy mayo.', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', 'Best Seller', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mo-3', 'Veg Momos (Steamed)', 'momos', 'Ask for price', 'Soft delicate hand-pleated dumplings stuffed with finely minced seasoned garden vegetables.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mo-4', 'Veg Fried Momos', 'momos', 'Ask for price', 'Golden crisp fried vegetable dumplings with a crunchy exterior and savory hot center.', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mo-5', 'Veg Oven-Baked Momos', 'momos', 'Ask for price', 'Tender vegetable momos baked in cheese and signature spicy herbs.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mo-6', 'Paneer Momos (Steamed)', 'momos', 'Ask for price', 'Steamed thin-wrapper dumplings filled with soft spiced grated paneer and herbs.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mo-7', 'Paneer Fried Momos', 'momos', 'Ask for price', 'Deep-fried golden paneer momos bursting with savory spiced cottage cheese.', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('mo-8', 'Paneer Oven-Baked Momos', 'momos', 'Ask for price', 'Rich cottage cheese dumplings baked in oven with creamy tandoori cheese crust.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-1', 'Birthday Combo', 'combos', 'Ask for price', 'Grand party platter curated for celebrations with pizzas, loaded burgers, fries, drinks & dessert.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 'Celebration Pack', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-2', 'Our Secret Dish Combo', 'combos', 'Ask for price', 'The chef surprise selection featuring off-menu delicacies and signature beverage pairings.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 'Exclusive', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-3', 'Family Combo', 'combos', 'Ask for price', 'Wholesome family meal package with medium pizzas, garlic breads, kurkure momos, and cold drinks.', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80', 'Family Size', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-4', '4-Item Combo', 'combos', 'Ask for price', 'Choose your favorite 4 items: Burger + Fries + Drink + Dessert or Pasta.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-5', '5-Item Combo', 'combos', 'Ask for price', 'Deluxe selection of 5 crowd-pleasing snacks and drinks for the ultimate hangout.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-6', '6-Item Combo', 'combos', 'Ask for price', 'Supreme party feast with 6 assorted items to satisfy every craving.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-7', 'Aloo Tikki Burger Combo', 'combos', 'Ask for price', 'Classic crisp Aloo Tikki Burger accompanied by golden fries and a chilled beverage.', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80', NULL, false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-8', 'Medium Veg Treat Pizza Combo', 'combos', 'Ask for price', 'Medium Veg Treat Pizza served with crispy fries, stuffed garlic bread, and cold drink.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', 'Value Pack', false, true, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-9', 'Extra Cheese Add-On', 'combos', 'Ask for price', 'Double layer of rich melted mozzarella on any pizza, burger, pasta, or sandwich.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-10', 'Extra Topping Add-On', 'combos', 'Ask for price', 'Add your choice of extra olives, paneer, golden corn, mushrooms, or jalapenos.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-11', 'Cheese Burst Crust Upgrade', 'combos', 'Ask for price', 'Crust filled with flowing molten cheese cream for a heavenly edge-to-edge treat.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 'Add-On', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-12', 'Thin Crust Upgrade', 'combos', 'Ask for price', 'Artisan crisp and light thin crust for a classic Italian pizza crunch.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', 'Add-On', false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-13', 'Signature Dips', 'combos', 'Ask for price', 'Choice of creamy garlic dip, spicy peri peri dip, tangy mint mayo, or cheese dip.', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;
INSERT INTO public.menu_items (id, name, category, price, description, image, badge, spicy, popular, vegetarian, available)
VALUES ('cb-14', 'Cold Drinks (500 ml)', 'combos', 'Ask for price', 'Chilled refreshing bottled beverages (500 ml) to quench your thirst.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', NULL, false, false, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    spicy = EXCLUDED.spicy,
    popular = EXCLUDED.popular,
    vegetarian = EXCLUDED.vegetarian;

-- 6. Authorize Owner Emails
-- cafe47516@gmail.com is authorized as Owner Admin:
INSERT INTO public.admin_users (email, role)
VALUES 
    ('cafe47516@gmail.com', 'owner'),
    ('owner@dreamcafe.in', 'owner')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;
