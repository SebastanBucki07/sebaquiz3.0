import { Component } from '@angular/core';
import { PreGameSidebarComponent } from './pre-game-header/pre-game-sidebar.component';
import { PreGameContentComponent } from './pre-game-content/pre-game-content.component';

@Component({
  selector: 'app-pre-game',
  imports: [PreGameSidebarComponent, PreGameContentComponent],
  standalone: true,
  templateUrl: './pre-game.component.html',
  styleUrl: './pre-game.component.css',
})
export class PreGameComponent {}
