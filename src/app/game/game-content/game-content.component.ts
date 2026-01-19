import { Component } from '@angular/core';
import {GameQuestionAreaComponent} from './game-question-area/game-question-area.component';

@Component({
  selector: 'app-game-content',
  imports: [
    GameQuestionAreaComponent
  ],
  templateUrl: './game-content.component.html',
  styleUrl: './game-content.component.css'
})
export class GameContentComponent {

}
