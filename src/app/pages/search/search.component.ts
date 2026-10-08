import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../../services/music.service';
import { SongWithGenre } from '../../models/music.models';
import { SongCardComponent } from '../../components/song-card/song-card.component';

@Component({
  selector: 'app-search',
  imports: [CommonModule, SongCardComponent],
  template: `
    <div class="search-page">
      <div class="page-header">
        <h1>Search Results</h1>
        @if (query()) {
          <p>for "{{ query() }}"</p>
        }
      </div>

      @if (loading()) {
        <div class="loading"><div class="spinner"></div></div>
      } @else if (songs().length === 0) {
        <div class="empty">
          <p>No songs found. Try a different search term.</p>
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
    .search-page { padding-bottom: 100px; }
    .page-header {
      padding: 48px 32px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 4px; }
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
    .empty { text-align: center; padding: 60px; color: rgba(255,255,255,0.35); font-size: 15px; }
    @media (max-width: 640px) {
      .page-header { padding: 32px 16px 16px; }
      .song-grid { padding: 0 16px; gap: 14px; }
    }
  `]
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private musicService = inject(MusicService);

  query = signal('');
  songs = signal<SongWithGenre[]>([]);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    await this.musicService.loadLikedIds();
    this.route.queryParams.subscribe(async (params) => {
      const q = params['q'] ?? '';
      this.query.set(q);
      this.loading.set(true);
      try {
        const results = await this.musicService.searchSongs(q);
        this.songs.set(results);
      } catch {
        this.songs.set([]);
      } finally {
        this.loading.set(false);
      }
    });
  }
}
