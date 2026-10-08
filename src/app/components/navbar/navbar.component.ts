import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="logo" aria-label="SoundWave home">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12h2l2-8 4 16 3-12 2 6 2-2h3"/>
          </svg>
          <span class="logo-text">SoundWave</span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">Discover</a>
          <a routerLink="/genres" routerLinkActive="active" class="nav-link">Playlists</a>
          <a routerLink="/liked" routerLinkActive="active" class="nav-link">
            Liked
            @if (likedCount() > 0) {
              <span class="badge">{{ likedCount() }}</span>
            }
          </a>
        </div>

        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Search songs, artists..."
            [value]="searchQuery()"
            (input)="onSearch($event)"
            (keyup.enter)="submitSearch()"
          />
          @if (searchQuery()) {
            <button class="clear-btn" (click)="clearSearch()" aria-label="Clear search">&times;</button>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(15, 15, 20, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .nav-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 32px;
      padding: 0 32px;
      height: 64px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: #fff;
      flex-shrink: 0;
    }
    .logo-icon {
      width: 28px;
      height: 28px;
      color: #14b8a6;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .nav-links {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
    .nav-link {
      padding: 8px 16px;
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-link:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.06);
    }
    .nav-link.active {
      color: #14b8a6;
      background: rgba(20, 184, 166, 0.1);
    }
    .badge {
      background: #14b8a6;
      color: #0a0a0f;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      line-height: 1;
    }
    .search-box {
      flex: 1;
      max-width: 400px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 0 12px;
      transition: border-color 0.2s ease, background 0.2s ease;
      margin-left: auto;
    }
    .search-box:focus-within {
      border-color: rgba(20, 184, 166, 0.4);
      background: rgba(255, 255, 255, 0.08);
    }
    .search-icon {
      width: 18px;
      height: 18px;
      color: rgba(255, 255, 255, 0.4);
      flex-shrink: 0;
    }
    .search-box input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: #fff;
      font-size: 14px;
      padding: 10px 0;
    }
    .search-box input::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
    .clear-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      font-size: 20px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }
    .clear-btn:hover {
      color: #fff;
    }
    @media (max-width: 768px) {
      .nav-inner { gap: 16px; padding: 0 16px; }
      .logo-text { display: none; }
      .search-box { max-width: none; }
      .nav-links { gap: 0; }
      .nav-link { padding: 8px 10px; font-size: 13px; }
    }
  `]
})
export class NavbarComponent {
  private musicService = inject(MusicService);

  searchQuery = signal('');
  likedCount = this.musicService.likedCount;

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  submitSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      window.location.hash = `/search?q=${encodeURIComponent(query)}`;
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}
