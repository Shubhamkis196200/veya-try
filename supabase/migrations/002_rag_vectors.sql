-- Add vector support for RAG
-- Run this in Supabase SQL Editor

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to profiles for user context
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- User memories table (stores important context)
CREATE TABLE IF NOT EXISTS user_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL, -- 'reading', 'preference', 'journal', 'insight'
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading history with embeddings
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  question TEXT,
  response TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users own memories" ON user_memories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own history" ON reading_history FOR ALL USING (auth.uid() = user_id);

-- Function to search similar memories (RAG)
CREATE OR REPLACE FUNCTION search_user_memories(
  query_embedding vector(1536),
  match_user_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  type TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    um.id,
    um.content,
    um.type,
    1 - (um.embedding <=> query_embedding) AS similarity
  FROM user_memories um
  WHERE um.user_id = match_user_id
    AND um.embedding IS NOT NULL
  ORDER BY um.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to search past readings
CREATE OR REPLACE FUNCTION search_reading_history(
  query_embedding vector(1536),
  match_user_id UUID,
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  question TEXT,
  response TEXT,
  type TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rh.id,
    rh.question,
    rh.response,
    rh.type,
    1 - (rh.embedding <=> query_embedding) AS similarity
  FROM reading_history rh
  WHERE rh.user_id = match_user_id
    AND rh.embedding IS NOT NULL
  ORDER BY rh.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Indexes for fast vector search
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON user_memories 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  
CREATE INDEX IF NOT EXISTS idx_history_embedding ON reading_history 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
