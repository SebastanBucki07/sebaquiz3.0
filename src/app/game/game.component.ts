import {Component} from '@angular/core';
import {GameContentComponent} from './game-content/game-content.component';
import {GameSidebarComponent} from './game-sidebar/game-sidebar.component';

@Component({
  selector: 'app-game',
  imports: [
    GameContentComponent,
    GameSidebarComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
}
