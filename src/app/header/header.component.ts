import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '../shared/game.service';
import {QuestionService} from '../shared/question-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router, private gameService: GameService, private questionService: QuestionService) {
  }

  newGame() {
    this.gameService.resetGame();

    this.questionService.resetQuestions();

    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    if (teams.length > 0) {
      this.gameService.setCurrentTeam(teams[0].name);
    }

    this.router.navigate(['/pregame']);
  }
}
