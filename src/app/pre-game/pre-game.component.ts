import { Component } from '@angular/core';
import {PreGameHeaderComponent} from './pre-game-header/pre-game-header.component';
import {PreGameContentComponent} from './pre-game-content/pre-game-content.component';

@Component({
  selector: 'app-pre-game',
  imports: [PreGameHeaderComponent, PreGameContentComponent],
  standalone:true,
  templateUrl: './pre-game.component.html',
  styleUrl: './pre-game.component.css'
})
export class PreGameComponent {

}
