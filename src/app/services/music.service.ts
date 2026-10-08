import { Injectable, signal, computed, inject } from '@angular/core';
import { supabase } from '../supabase.client';
import { Genre, Song, SongWithGenre } from '../models/music.models';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private genresCache: Genre[] | null = null;
  private genresPromise: Promise<Genre[]> | null = null;

  readonly likedSongIds = signal<Set<string>>(new Set());
  readonly likedCount = computed(() => this.likedSongIds().size);

  private likedLoaded = false;

  async getGenres(): Promise<Genre[]> {
    if (this.genresCache) return this.genresCache;
    if (this.genresPromise) return this.genresPromise;

    this.genresPromise = (async () => {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');
      if (error) throw error;
      this.genresCache = data as Genre[];
      return this.genresCache!;
    })();

    return this.genresPromise;
  }

  async getNewReleases(limit: number = 12): Promise<SongWithGenre[]> {
    const { data, error } = await supabase
      .from('songs')
      .select('*, genre:genres(*)')
      .order('release_date', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return this.mapSongs(data);
  }

  async getTopLiked(limit: number = 12): Promise<SongWithGenre[]> {
    const { data, error } = await supabase
      .from('songs')
      .select('*, genre:genres(*)')
      .order('like_count', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return this.mapSongs(data);
  }

  async getSongsByGenre(genreId: string): Promise<SongWithGenre[]> {
    const { data, error } = await supabase
      .from('songs')
      .select('*, genre:genres(*)')
      .eq('genre_id', genreId)
      .order('like_count', { ascending: false });
    if (error) throw error;
    return this.mapSongs(data);
  }

  async searchSongs(query: string): Promise<SongWithGenre[]> {
    const { data, error } = await supabase
      .from('songs')
      .select('*, genre:genres(*)')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`)
      .order('like_count', { ascending: false })
      .limit(20);
    if (error) throw error;
    return this.mapSongs(data);
  }

  async getLikedSongs(): Promise<SongWithGenre[]> {
    const ids = Array.from(this.likedSongIds());
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from('songs')
      .select('*, genre:genres(*)')
      .in('id', ids)
      .order('like_count', { ascending: false });
    if (error) throw error;
    return this.mapSongs(data);
  }

  isLiked(songId: string): boolean {
    return this.likedSongIds().has(songId);
  }

  toggleLike(song: Song): void {
    const current = new Set(this.likedSongIds());
    if (current.has(song.id)) {
      current.delete(song.id);
    } else {
      current.add(song.id);
    }
    this.likedSongIds.set(current);
    this.persistLikes();
  }

  async loadLikedIds(): Promise<void> {
    if (this.likedLoaded) return;
    this.likedLoaded = true;
    try {
      const stored = localStorage.getItem('likedSongs');
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        this.likedSongIds.set(new Set(ids));
      }
    } catch {
      // ignore parse errors
    }
  }

  private persistLikes(): void {
    try {
      const ids = Array.from(this.likedSongIds());
      localStorage.setItem('likedSongs', JSON.stringify(ids));
    } catch {
      // ignore storage errors
    }
  }

  private mapSongs(data: any[] | null): SongWithGenre[] {
    if (!data) return [];
    return data.map((row) => {
      const { genre, ...song } = row;
      return { ...song, genre: genre as Genre | undefined };
    });
  }
}
