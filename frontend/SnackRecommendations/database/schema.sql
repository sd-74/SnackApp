-- Snack Recommendation App Database Schema
-- Run this in Supabase SQL Editor

-- Create user profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create snacks table
CREATE TABLE snacks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  image_url TEXT NOT NULL,
  flavors TEXT[] DEFAULT '{}', -- ["chocolate", "sweet", "vanilla"]
  attributes TEXT[] DEFAULT '{}', -- ["chip", "potato", "crunchy"]
  tags TEXT[] DEFAULT '{}', -- ["healthy", "fried", "organic", "spicy"]
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user interactions table with ratings
CREATE TABLE user_snack_interactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  snack_id INTEGER REFERENCES snacks(id),
  action TEXT NOT NULL CHECK (action IN ('like', 'dislike', 'skip')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Optional 1-5 star rating
  notes TEXT, -- Optional user notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, snack_id) -- Prevent duplicate interactions
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE snacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_snack_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for snacks (public read)
CREATE POLICY "Anyone can view snacks" ON snacks
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for user_snack_interactions
CREATE POLICY "Users can view own interactions" ON user_snack_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON user_snack_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions" ON user_snack_interactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_snacks_flavors ON snacks USING GIN(flavors);
CREATE INDEX idx_snacks_attributes ON snacks USING GIN(attributes);
CREATE INDEX idx_snacks_tags ON snacks USING GIN(tags);
CREATE INDEX idx_interactions_user_id ON user_snack_interactions(user_id);
CREATE INDEX idx_interactions_snack_id ON user_snack_interactions(snack_id);
CREATE INDEX idx_interactions_action ON user_snack_interactions(action);
CREATE INDEX idx_interactions_rating ON user_snack_interactions(rating) WHERE rating IS NOT NULL;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_snack_interactions_updated_at 
  BEFORE UPDATE ON user_snack_interactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO snacks (name, brand, image_url, flavors, attributes, tags, description) VALUES
('Doritos Nacho Cheese', 'Frito-Lay', 'https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/7f461361-8e91-42e9-a2a7-7ea8d447e67f-retina-large.png', 
 ARRAY['cheese', 'nacho', 'salty'], ARRAY['tortilla-chip', 'crunchy'], ARRAY['popular', 'fried'], 
 'Classic nacho cheese flavored tortilla chips'),
('Oreos Original', 'Nabisco', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh4k251xFF_9ijySYa4PoRBwdRDOixcZmkhw&s',
 ARRAY['chocolate', 'sweet', 'vanilla'], ARRAY['cookie', 'sandwich'], ARRAY['popular', 'sweet'],
 'Classic chocolate sandwich cookies with cream filling'),
('Pretzel Crisps Original', 'Snack Factory', 'https://bulkpricedfoodshoppe.com/wp-content/uploads/2017/02/product_5_1_512702.jpg',
 ARRAY['plain', 'salty'], ARRAY['pretzel', 'crispy'], ARRAY['healthy', 'baked'],
 'Flat, crunchy pretzel crackers perfect for dipping');