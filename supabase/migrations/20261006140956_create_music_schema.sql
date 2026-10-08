/*
# Create music discovery schema

1. New Tables
- `genres`: Music genres (Electronic, Hip-Hop, Rock, Jazz, Pop, R&B, etc.)
  - id (uuid, PK)
  - name (text, unique, not null) — display name
  - slug (text, unique, not null) — URL-friendly identifier
  - color (text) — hex color for UI theming per genre
  - description (text) — short blurb
  - created_at (timestamp)
- `songs`: Individual songs/tracks
  - id (uuid, PK)
  - title (text, not null)
  - artist (text, not null)
  - album (text)
  - genre_id (uuid, FK to genres, not null)
  - cover_url (text) — album art image URL
  - audio_url (text) — audio stream URL
  - duration_seconds (int) — track length
  - release_date (date) — when the song was released
  - play_count (int, default 0) — total plays
  - like_count (int, default 0) — total likes
  - created_at (timestamp)

2. Security
- Enable RLS on both tables.
- Single-tenant app (no sign-in): allow anon + authenticated full CRUD.
- All data is intentionally public/shared.

3. Indexes
- Index on songs.genre_id for genre-filtered queries.
- Index on songs.release_date for "new releases" sorting.
- Index on songs.like_count for "most liked" sorting.
*/

CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  color text NOT NULL DEFAULT '#3b82f6',
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  album text,
  genre_id uuid NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  cover_url text,
  audio_url text,
  duration_seconds int NOT NULL DEFAULT 0,
  release_date date NOT NULL DEFAULT CURRENT_DATE,
  play_count int NOT NULL DEFAULT 0,
  like_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_songs_genre_id ON songs(genre_id);
CREATE INDEX IF NOT EXISTS idx_songs_release_date ON songs(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_songs_like_count ON songs(like_count DESC);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_genres" ON genres;
CREATE POLICY "anon_select_genres" ON genres FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_genres" ON genres;
CREATE POLICY "anon_insert_genres" ON genres FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_genres" ON genres;
CREATE POLICY "anon_update_genres" ON genres FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_genres" ON genres;
CREATE POLICY "anon_delete_genres" ON genres FOR DELETE
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_songs" ON songs;
CREATE POLICY "anon_select_songs" ON songs FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_songs" ON songs;
CREATE POLICY "anon_insert_songs" ON songs FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_songs" ON songs;
CREATE POLICY "anon_update_songs" ON songs FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_songs" ON songs;
CREATE POLICY "anon_delete_songs" ON songs FOR DELETE
TO anon, authenticated USING (true);
