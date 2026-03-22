import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { GameStateService } from '../../../../services/game-state.service';
import { PointsService } from '../../../../services/points-service.service';
import { GameService } from '../../../../services/game.service';
import { QuestionService } from '../../../../services/question-service.service';
import { getClubInfo } from '../../../../shared/mappers/clubMapper';
import { calculateGamePoints } from '../../../../shared/utils/text-logic';
import { TeamGridState } from '../../../../shared/models/teams/teamGridState.interface';

@Component({
  selector: 'app-tic-tac-toe-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tic-tac-toe-category.component.html',
  styleUrls: ['./tic-tac-toe-category.component.css'],
})
export class TicTacToeCategoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  gridData: any = null;
  cellStatus: boolean[][] = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];
  showMissing: boolean = false;
  gameFinished = false;

  // Punktacja (zgodna z Twoim modelem WritingCategory)
  readonly MAX_POINTS = 9;
  totalCorrect = 0;
  accuracyPercentage = 0;
  earnedPoints = 0;

  // Obsługa drużyn
  currentTeam: TeamGridState | null = null;

  constructor(
    private questionService: QuestionService,
    private gameStateService: GameStateService,
    private gameService: GameService,
    private pointsService: PointsService
  ) {}

  ngOnInit() {
    // 1. Pobieramy aktualną drużynę z GameState
    this.gameStateService.teams$.pipe(takeUntil(this.destroy$)).subscribe((teams) => {
      // W modelu TicTacToe zazwyczaj gra jedna drużyna na turę,
      // pobieramy tę, która jest aktualnie "przy głosie" w GameService
      const activeTeamName = this.gameService.getCurrentTeam();
      const team = teams.find((t) => t.name === activeTeamName) || teams[0];

      if (team) {
        this.currentTeam = {
          ...team,
          calculatedPoints: 0,
        };
      }
    });

    // 2. Subskrypcja pytania (planszy)
    this.questionService.question$.pipe(takeUntil(this.destroy$)).subscribe((q) => {
      if (q && q.question === 'Football Grid' && q.answers?.[0]?.value) {
        try {
          this.gridData = JSON.parse(q.answers[0].value);
          this.resetGrid();
        } catch (e) {
          console.error('Błąd planszy:', e);
        }
      }
    });
  }

  toggleCell(r: number, c: number) {
    if (this.showMissing || this.gameFinished) return;

    this.cellStatus[r][c] = !this.cellStatus[r][c];
    this.calculateScore();
  }

  calculateScore() {
    this.totalCorrect = this.cellStatus.flat().filter((v) => v).length;
    this.accuracyPercentage = Math.round((this.totalCorrect / 9) * 100);

    this.earnedPoints = calculateGamePoints(this.totalCorrect, 9, this.MAX_POINTS);

    if (this.currentTeam) {
      this.currentTeam.calculatedPoints = this.earnedPoints;
    }
  }

  // Odpowiednik finishGame()
  revealMissing() {
    if (this.gameFinished) return;

    this.showMissing = true;
    this.gameFinished = true;

    // Informujemy system o odkryciu odpowiedzi (wszystkich trzech)
    // this.questionService.revealAnswer(0);
    // this.questionService.revealAnswer(1);
    // this.questionService.revealAnswer(2);

    if (this.currentTeam) {
      this.pointsService.setPoints(this.earnedPoints);
      this.gameService.setCurrentTeam(this.currentTeam.name);
    }
  }

  // Twoja funkcja pozostaje BEZ ZMIAN, bo w kroku 1 zachowaliśmy strukturę
  getMatchingFootballers(r: number, c: number): string[] {
    if (!this.gridData?.grid) return [];
    return this.gridData.grid[r][c].map((p: any) => p.name);
  }

  loadNextBoard() {
    this.gameFinished = false;
    this.questionService.loadRandomQuestion('football-grid', 'Ekstraklasa Grid');
  }

  resetGrid() {
    this.showMissing = false;
    this.gameFinished = false;
    this.cellStatus = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    this.earnedPoints = 0;
    this.totalCorrect = 0;
    this.accuracyPercentage = 0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getHeaderInfo(label: string) {
    return getClubInfo(label);
  }
}
