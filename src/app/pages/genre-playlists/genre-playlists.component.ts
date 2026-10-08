import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MusicService } from '../../services/music.service';
import { Genre, SongWithGenre } from '../../models/music.models';
import { SongCardComponent } from '../../components/song-card/song-card.component';

@Component({
  selector: 'app-genre-playlists',
  imports: [CommonModule, SongCardComponent, RouterLink, RouterLinkActive],
  template: `
    <div class="genres-page">
      <div class="genre-pills">
        <a routerLink="/genres" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="pill">All</a>
        @for (genre of genres(); track genre.id) {
          <a href="#/genres/{{ genre.slug }}" class="pill" [class.active]="selectedGenre()?.slug === genre.slug"
            [style.border-color]="selectedGenre()?.slug === genre.slug ? genre.color : 'transparent'">
            {{ genre.name }}
          </a>
        }
      </div>

      @if (selectedGenre()) {
        <div class="genre-banner" [style.background]="selectedGenre()!.color + '11'">
          <div class="banner-glow" [style.background]="selectedGenre()!.color"></div>
          <div class="banner-content">
            <h1 class="banner-title" [style.color]="selectedGenre()!.color">{{ selectedGenre()!.name }}</h1>
            <p class="banner-desc">{{ selectedGenre()!.description }}</p>
            <span class="banner-count">{{ songs().length }} tracks</span>
          </div>
        </div>
      } @else {
        <div class="page-header">
          <h1>Genre Playlists</h1>
          <p>Pick a genre to explore its full catalog</p>
        </div>
        <div class="genre-cards">
          @for (genre of genres(); track genre.id) {
            <a href="#/genres/{{ genre.slug }}" class="genre-tile" [style.borderColor]="genre.color + '33'">
              <div class="tile-glow" [style.background]="genre.color"></div>
              <h3 [style.color]="genre.color">{{ genre.name }}</h3>
              <p>{{ genre.description }}</p>
            </a>
          }
        </div>
      }

      @if (selectedGenre()) {
        @if (loading()) {
          <div class="loading"><div class="spinner"></div></div>
        } @else if (songs().length === 0) {
          <div class="empty">No tracks in this genre yet.</div>
        } @else {
          <div class="song-grid">
            @for (song of songs(); track song.id) {
              <app-song-card [songData]="song" />
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .genres-page { padding-bottom: 100px; }
    .page-header { padding: 48px 32px 16px; max-width: 1400px; margin: 0 auto; }
    .page-header h1 { font-size: 32px; font-weight: 800; color: #fff; margin: 0 0 8px; }
    .page-header p { font-size: 16px; color: rgba(255,255,255,0.45); margin: 0; }
    .genre-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 24px 32px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .pill {
      padding: 8px 18px;
      border-radius: 20px;
      border: 1.5px solid transparent;
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .pill:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .pill.active { background: rgba(20,184,166,0.12); color: #14b8a6; border-color: #14b8a6; }
    .genre-banner {
      position: relative;
      padding: 40px 32px;
      max-width: 1400px;
      margin: 0 auto 32px;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .banner-glow {
      position: absolute;
      top: -60%;
      right: -10%;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      opacity: 0.08;
      filter: blur(60px);
    }
    .banner-content { position: relative; z-index: 1; }
    .banner-title { font-size: 36px; font-weight: 800; margin: 0 0 8px; }
    .banner-desc { font-size: 15px; color: rgba(255,255,255,0.5); margin: 0 0 12px; }
    .banner-count { font-size: 13px; color: rgba(255,255,255,0.35); }
    .genre-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
      padding: 16px 32px 32px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .genre-tile {
      position: relative;
      display: block;
      padding: 32px 28px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.03);
      text-decoration: none;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .genre-tile:hover { transform: translateY(-3px); background: rgba(255,255,255,0.06); }
    .tile-glow {
      position: absolute; top: -40%; right: -20%;
      width: 160px; height: 160px;
      border-radius: 50%; opacity: 0.1; filter: blur(30px);
      transition: opacity 0.3s ease;
    }
    .genre-tile:hover .tile-glow { opacity: 0.2; }
    .genre-tile h3 { font-size: 22px; font-weight: 700; margin: 0 0 8px; position: relative; }
    .genre-tile p { font-size: 13px; color: rgba(255,255,255,0.4); margin: 0; line-height: 1.5; position: relative; }
    .song-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      padding: 0 32px 32px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .loading { text-align: center; padding: 60px; }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #14b8a6;
      border-radius: 50%;
      margin: 0 auto;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty { text-align: center; padding: 60px; color: rgba(255,255,255,0.35); font-size: 15px; }
    @media (max-width: 640px) {
      .genre-pills { padding: 16px; }
      .page-header, .genre-banner, .song-grid, .genre-cards { padding-left: 16px; padding-right: 16px; }
      .banner-title { font-size: 28px; }
    }
  `]
})
export class GenrePlaylistsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private musicService = inject(MusicService);

  genres = signal<Genre[]>([]);
  selectedGenre = signal<Genre | null>(null);
  songs = signal<SongWithGenre[]>([]);
  loading = signal(false);

  async ngOnInit(): Promise<void> {
    await this.musicService.loadLikedIds();
    const genres = await this.musicService.getGenres();
    this.genres.set(genres);

    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.selectedGenre.set(null);
        this.songs.set([]);
        return;
      }
      const genre = genres.find(g => g.slug === slug);
      if (!genre) {
        this.selectedGenre.set(null);
        return;
      }
      this.selectedGenre.set(genre);
      this.loading.set(true);
      try {
        const songs = await this.musicService.getSongsByGenre(genre.id);
        this.songs.set(songs);
      } catch {
        this.songs.set([]);
      } finally {
        this.loading.set(false);
      }
    });
  }
}
