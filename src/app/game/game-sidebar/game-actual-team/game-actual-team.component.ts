import { Component } from '@angular/core';
import { GameService } from '../../../shared/game.service';
import { MATERIAL_IMPORTS } from '../../../shared/material';

@Component({
  selector: 'app-game-actual-team',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './game-actual-team.component.html',
  styleUrl: './game-actual-team.component.css',
})
export class GameActualTeamComponent {
  constructor(private gameService: GameService) {}

  get currentTeam$() {
    return this.gameService.currentTeam$;
  }
}
