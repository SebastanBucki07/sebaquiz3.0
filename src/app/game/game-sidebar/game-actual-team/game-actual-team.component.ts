import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-game-actual-team',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './game-actual-team.component.html',
  styleUrl: './game-actual-team.component.css',
})
export class GameActualTeamComponent {
  constructor(private gameService: GameService) {}

  get currentTeam$() {
    return this.gameService.currentTeam$;
  }
}
