-- Supabase Schema for Vora Landing Page
-- Run this in your Supabase SQL editor

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  position INTEGER GENERATED ALWAYS AS IDENTITY
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to insert into waitlist" ON waitlist;
DROP POLICY IF EXISTS "Allow public to read waitlist count" ON waitlist;

-- Create policy to allow inserts (for the public to join waitlist)
CREATE POLICY "Allow public to insert into waitlist" 
ON waitlist FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading (for displaying waitlist count)
CREATE POLICY "Allow public to read waitlist count" 
ON waitlist FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist(position);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Optional: Create a function to get waitlist statistics
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'total_count', (SELECT COUNT(*) FROM waitlist),
    'today_count', (SELECT COUNT(*) FROM waitlist WHERE created_at >= CURRENT_DATE),
    'this_week_count', (SELECT COUNT(*) FROM waitlist WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    'top_referral_sources', (
      SELECT json_agg(json_build_object('source', referral_source, 'count', count))
      FROM (
        SELECT referral_source, COUNT(*) as count
        FROM waitlist
        WHERE referral_source IS NOT NULL
        GROUP BY referral_source
        ORDER BY count DESC
        LIMIT 5
      ) as sources
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_waitlist_stats() TO anon, authenticated; 