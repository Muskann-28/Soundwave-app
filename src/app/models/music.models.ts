export interface Genre {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  genre_id: string;
  cover_url: string | null;
  audio_url: string | null;
  duration_seconds: number;
  release_date: string;
  play_count: number;
  like_count: number;
}

export interface SongWithGenre extends Song {
  genre?: Genre;
}
