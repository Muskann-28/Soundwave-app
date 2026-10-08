import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { Genre, SongWithGenre } from '../../models/music.models';
import { SongCardComponent } from '../../components/song-card/song-card.component';

@Component({
  selector: 'app-discover',
  imports: [CommonModule, SongCardComponent],
  template: `
    <div class="discover">
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Discover Your Next Favorite Song</h1>
          <p class="hero-subtitle">Fresh tracks across every genre, updated daily</p>
        </div>
        <div class="hero-glow"></div>
      </section>

      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading music...</p>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <p>Couldn't load songs. Please try again later.</p>
        </div>
      } @else {
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">New Releases</h2>
            <span class="section-sub">Latest tracks fresh off the press</span>
          </div>
          <div class="grid">
            @for (song of newReleases(); track song.id) {
              <app-song-card [songData]="song" />
            }
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Most Liked</h2>
            <span class="section-sub">What everyone is loving right now</span>
          </div>
          <div class="grid">
            @for (song of topLiked(); track song.id) {
              <app-song-card [songData]="song" />
            }
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Browse by Genre</h2>
            <span class="section-sub">Pick a vibe and dive in</span>
          </div>
          <div class="genre-grid">
            @for (genre of genres(); track genre.id) {
              <a href="#/genres/{{ genre.slug }}" class="genre-card" [style.border-color]="genre.color + '33'">
                <div class="genre-card-bg" [style.background]="genre.color"></div>
                <div class="genre-card-content">
                  <h3>{{ genre.name }}</h3>
                  <p>{{ genre.description }}</p>
                </div>
              </a>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .discover { padding-bottom: 100px; }
    .hero {
      position: relative;
      padding: 64px 32px 48px;
      text-align: center;
      overflow: hidden;
    }
    .hero-content { position: relative; z-index: 1; }
    .hero-title {
      font-size: clamp(28px, 5vw, 48px);
      font-weight: 800;
      letter-spacing: -1px;
      margin: 0 0 12px;
      background: linear-gradient(135deg, #fff 0%, #14b8a6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-subtitle {
      font-size: 16px;
      color: rgba(255,255,255,0.5);
      margin: 0;
    }
    .hero-glow {
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 400px;
      background: radial-gradient(ellipse at center, rgba(20,184,166,0.15), transparent 70%);
      filter: blur(40px);
    }
    .section {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .section-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }
    .section-sub {
      font-size: 14px;
      color: rgba(255,255,255,0.4);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .genre-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    .genre-card {
      position: relative;
      display: block;
      padding: 28px 24px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.03);
      text-decoration: none;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .genre-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255,255,255,0.15);
    }
    .genre-card-bg {
      position: absolute;
      top: -40%;
      right: -20%;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      opacity: 0.12;
      filter: blur(20px);
      transition: opacity 0.3s ease;
    }
    .genre-card:hover .genre-card-bg { opacity: 0.25; }
    .genre-card-content { position: relative; z-index: 1; }
    .genre-card h3 { font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 6px; }
    .genre-card p { font-size: 13px; color: rgba(255,255,255,0.45); margin: 0; line-height: 1.4; }
    .loading-state, .error-state {
      text-align: center;
      padding: 80px 32px;
      color: rgba(255,255,255,0.4);
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #14b8a6;
      border-radius: 50%;
      margin: 0 auto 16px;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 640px) {
      .hero { padding: 40px 16px 32px; }
      .section { padding: 24px 16px; }
      .grid { gap: 14px; }
    }
  `]
})
export class DiscoverComponent implements OnInit {
  private musicService = inject(MusicService);

  loading = signal(true);
  error = signal(false);
  genres = signal<Genre[]>([]);
  newReleases = signal<SongWithGenre[]>([]);
  topLiked = signal<SongWithGenre[]>([]);

  async ngOnInit(): Promise<void> {
    await this.musicService.loadLikedIds();
    try {
      const [genres, newSongs, topSongs] = await Promise.all([
        this.musicService.getGenres(),
        this.musicService.getNewReleases(12),
        this.musicService.getTopLiked(12),
      ]);
      this.genres.set(genres);
      this.newReleases.set(newSongs);
      this.topLiked.set(topSongs);
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
