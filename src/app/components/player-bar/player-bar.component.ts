import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { SongWithGenre } from '../../models/music.models';

@Component({
  selector: 'app-player-bar',
  imports: [CommonModule],
  template: `
    @if (currentSong()) {
      <div class="player-bar">
        <div class="player-inner">
          <div class="now-playing">
            @if (currentSong()!.cover_url) {
              <img [src]="currentSong()!.cover_url" class="np-cover" alt="" />
            } @else {
              <div class="np-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
            }
            <div class="np-info">
              <div class="np-title">{{ currentSong()!.title }}</div>
              <div class="np-artist">{{ currentSong()!.artist }}</div>
            </div>
          </div>

          <div class="controls">
            <button class="ctrl-btn" (click)="togglePlay()" [attr.aria-label]="isPlaying() ? 'Pause' : 'Play'">
              @if (isPlaying()) {
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              }
            </button>
            <button class="ctrl-btn-sm" (click)="stop()" aria-label="Stop">
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
            </button>
          </div>

          <div class="like-section">
            <button class="like-btn" (click)="toggleLike()" [class.liked]="isLiked"
              [attr.aria-label]="isLiked ? 'Unlike' : 'Like'">
              <svg viewBox="0 0 24 24" [attr.fill]="isLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .player-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 200;
      background: rgba(15, 15, 20, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .player-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 12px 32px;
    }
    .now-playing {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
    }
    .np-cover {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }
    .np-placeholder {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.15);
      flex-shrink: 0;
    }
    .np-placeholder svg { width: 24px; height: 24px; }
    .np-info { min-width: 0; }
    .np-title {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .np-artist {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .ctrl-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: #14b8a6;
      color: #0a0a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .ctrl-btn:hover { transform: scale(1.08); background: #0d9488; }
    .ctrl-btn svg { width: 22px; height: 22px; }
    .ctrl-btn-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .ctrl-btn-sm:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .ctrl-btn-sm svg { width: 16px; height: 16px; }
    .like-section { flex-shrink: 0; }
    .like-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      padding: 4px;
      transition: all 0.2s ease;
      line-height: 0;
    }
    .like-btn svg { width: 22px; height: 22px; }
    .like-btn:hover { color: #ef4444; }
    .like-btn.liked { color: #ef4444; }
    @media (max-width: 640px) {
      .player-inner { padding: 10px 16px; gap: 12px; }
      .like-section { display: none; }
    }
  `]
})
export class PlayerBarComponent {
  private musicService = inject(MusicService);

  currentSong = signal<SongWithGenre | null>(null);
  isPlaying = signal(false);
  isLiked = false;

  constructor() {
    window.addEventListener('play-song', ((e: CustomEvent<SongWithGenre>) => {
      this.currentSong.set(e.detail);
      this.isPlaying.set(true);
      this.isLiked = this.musicService.isLiked(e.detail.id);
    }) as EventListener);
  }

  togglePlay(): void {
    this.isPlaying.update(v => !v);
  }

  stop(): void {
    this.currentSong.set(null);
    this.isPlaying.set(false);
  }

  toggleLike(): void {
    const song = this.currentSong();
    if (song) {
      this.musicService.toggleLike(song);
      this.isLiked = this.musicService.isLiked(song.id);
    }
  }
}
