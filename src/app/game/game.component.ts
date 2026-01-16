import {Component} from '@angular/core';
import {GameHeaderComponent} from '../game-header/game-header.component';
import {GameContentComponent} from '../game-content/game-content.component';

@Component({
  selector: 'app-game',
  imports: [
    GameHeaderComponent,
    GameContentComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
}
