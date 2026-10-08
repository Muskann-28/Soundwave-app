import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { SongWithGenre } from '../../models/music.models';

@Component({
  selector: 'app-song-card',
  imports: [CommonModule],
  template: `
    <div class="card" (click)="onPlay()">
      <div class="cover-wrap">
        @if (song().cover_url) {
          <img [src]="song().cover_url" [alt]="song().title" class="cover" loading="lazy" />
        } @else {
          <div class="cover-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        }
        <div class="play-overlay">
          <button class="play-btn" (click)="onPlay(); $event.stopPropagation()" aria-label="Play song">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
      </div>

      <div class="info">
        <div class="info-top">
          <h3 class="title" [title]="song().title">{{ song().title }}</h3>
          <button class="like-btn" (click)="onLike(); $event.stopPropagation()" [class.liked]="isLiked"
            [attr.aria-label]="isLiked ? 'Unlike' : 'Like'">
            <svg viewBox="0 0 24 24" [attr.fill]="isLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <p class="artist">{{ song().artist }}</p>
        @if (song().genre) {
          <span class="genre-tag" [style.background]="song().genre!.color + '22'" [style.color]="song().genre!.color">
            {{ song().genre!.name }}
          </span>
        }
        <div class="meta">
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>
            {{ formatCount(song().play_count) }}
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {{ formatCount(song().like_count) }}
          </span>
          <span class="meta-spacer"></span>
          <span class="duration">{{ formatDuration(song().duration_seconds) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    .card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.12);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }
    .cover-wrap {
      position: relative;
      aspect-ratio: 1;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 14px;
    }
    .cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }
    .card:hover .cover {
      transform: scale(1.05);
    }
    .cover-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: rgba(255,255,255,0.15);
    }
    .cover-placeholder svg { width: 48px; height: 48px; }
    .play-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.35);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .card:hover .play-overlay { opacity: 1; }
    .play-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: #14b8a6;
      color: #0a0a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transform: scale(0.8);
      transition: transform 0.3s ease;
    }
    .card:hover .play-btn { transform: scale(1); }
    .play-btn svg { width: 22px; height: 22px; margin-left: 2px; }
    .info-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .title {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .like-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.35);
      cursor: pointer;
      padding: 2px;
      flex-shrink: 0;
      transition: all 0.2s ease;
      line-height: 0;
    }
    .like-btn svg { width: 18px; height: 18px; }
    .like-btn:hover { color: #ef4444; transform: scale(1.15); }
    .like-btn.liked { color: #ef4444; animation: pop 0.3s ease; }
    @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
    .artist {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin: 4px 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .genre-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      margin-bottom: 10px;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .meta-spacer { flex: 1; }
    .duration { font-variant-numeric: tabular-nums; }
  `]
})
export class SongCardComponent {
  private musicService = inject(MusicService);

  private _song: SongWithGenre | null = null;
  song = () => this._song!;
  isLiked = false;

  @Input({ required: true })
  set songData(value: SongWithGenre) {
    this._song = value;
    this.isLiked = this.musicService.isLiked(value.id);
  }

  onPlay(): void {
    if (this._song) {
      window.dispatchEvent(new CustomEvent('play-song', { detail: this._song }));
    }
  }

  onLike(): void {
    if (this._song) {
      this.musicService.toggleLike(this._song);
      this.isLiked = this.musicService.isLiked(this._song.id);
    }
  }

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return String(n);
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
