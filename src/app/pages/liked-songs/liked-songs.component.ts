import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { SongWithGenre } from '../../models/music.models';
import { SongCardComponent } from '../../components/song-card/song-card.component';

@Component({
  selector: 'app-liked-songs',
  imports: [CommonModule, SongCardComponent],
  template: `
    <div class="liked-page">
      <div class="page-header">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <h1>Liked Songs</h1>
        <p>{{ songs().length }} {{ songs().length === 1 ? 'track' : 'tracks' }} you love</p>
      </div>

      @if (loading()) {
        <div class="loading"><div class="spinner"></div></div>
      } @else if (songs().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h3>No liked songs yet</h3>
          <p>Tap the heart on any song to save it here.</p>
          <a href="#/" class="browse-btn">Browse Music</a>
        </div>
      } @else {
        <div class="song-grid">
          @for (song of songs(); track song.id) {
            <app-song-card [songData]="song" />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .liked-page { padding-bottom: 100px; }
    .page-header {
      padding: 48px 32px 32px;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .header-icon {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(239,68,68,0.3);
    }
    .header-icon svg { width: 38px; height: 38px; color: #fff; }
    .page-header h1 { font-size: 32px; font-weight: 800; color: #fff; margin: 0 0 6px; }
    .page-header p { font-size: 15px; color: rgba(255,255,255,0.4); margin: 0; }
    .song-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      padding: 0 32px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .loading { text-align: center; padding: 60px; }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #14b8a6;
      border-radius: 50%; margin: 0 auto;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state {
      text-align: center;
      padding: 60px 32px 80px;
      max-width: 400px;
      margin: 0 auto;
    }
    .empty-icon {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
      color: rgba(255,255,255,0.2);
    }
    .empty-icon svg { width: 32px; height: 32px; }
    .empty-state h3 { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 8px; }
    .empty-state p { font-size: 14px; color: rgba(255,255,255,0.4); margin: 0 0 24px; }
    .browse-btn {
      display: inline-block;
      padding: 12px 28px;
      border-radius: 24px;
      background: #14b8a6;
      color: #0a0a0f;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .browse-btn:hover { background: #0d9488; transform: scale(1.04); }
    @media (max-width: 640px) {
      .page-header { padding: 32px 16px 24px; }
      .song-grid { padding: 0 16px; gap: 14px; }
    }
  `]
})
export class LikedSongsComponent implements OnInit {
  private musicService = inject(MusicService);

  songs = signal<SongWithGenre[]>([]);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    await this.musicService.loadLikedIds();
    try {
      const liked = await this.musicService.getLikedSongs();
      this.songs.set(liked);
    } catch {
      this.songs.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
