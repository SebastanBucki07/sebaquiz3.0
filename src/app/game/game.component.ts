import { Component } from '@angular/core';
import { GameSidebarComponent } from './game-sidebar/game-sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [GameSidebarComponent, RouterOutlet],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {}
