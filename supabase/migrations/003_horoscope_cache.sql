-- Daily horoscope cache table
-- Stores one reading per zodiac sign per day (only 12 API calls instead of 10,000!)

CREATE TABLE IF NOT EXISTS daily_horoscope_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  zodiac_sign TEXT NOT NULL,
  reading JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, zodiac_sign)
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_horoscope_cache_date_sign 
  ON daily_horoscope_cache(date, zodiac_sign);

-- Auto-delete old cache (keep 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_horoscopes()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM daily_horoscope_cache WHERE date < CURRENT_DATE - INTERVAL '7 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to cleanup on insert
DROP TRIGGER IF EXISTS cleanup_horoscopes_trigger ON daily_horoscope_cache;
CREATE TRIGGER cleanup_horoscopes_trigger
  AFTER INSERT ON daily_horoscope_cache
  FOR EACH STATEMENT EXECUTE FUNCTION cleanup_old_horoscopes();

-- No RLS needed - cache is public/shared
