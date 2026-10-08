import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { provideRouter, Routes } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { MusicService } from './app/services/music.service';
import { NavbarComponent } from './app/components/navbar/navbar.component';
import { PlayerBarComponent } from './app/components/player-bar/player-bar.component';
import { DiscoverComponent } from './app/pages/discover/discover.component';
import { GenrePlaylistsComponent } from './app/pages/genre-playlists/genre-playlists.component';
import { LikedSongsComponent } from './app/pages/liked-songs/liked-songs.component';
import { SearchComponent } from './app/pages/search/search.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, PlayerBarComponent],
  template: `
    <app-navbar />
    <main class="app-main">
      <router-outlet />
    </main>
    <app-player-bar />
  `,
  styles: [`
    .app-main { min-height: calc(100vh - 64px); }
  `]
})
export class App implements OnInit {
  private musicService = inject(MusicService);

  async ngOnInit(): Promise<void> {
    await this.musicService.loadLikedIds();
  }
}

const routes: Routes = [
  { path: '', component: DiscoverComponent },
  { path: 'genres', component: GenrePlaylistsComponent },
  { path: 'genres/:slug', component: GenrePlaylistsComponent },
  { path: 'liked', component: LikedSongsComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '' },
];

bootstrapApplication(App, {
  providers: [provideRouter(routes)],
}).catch(err => console.error(err));
