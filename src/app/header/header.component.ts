import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router, private gameService: GameService) {}

  newGame() {
    this.gameService.resetGame();
    this.router.navigate(['/pregame']);
  }
}
