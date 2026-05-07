import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { GameStateService } from '../../../../services/game-state.service';
import { PointsService } from '../../../../services/points-service.service';
import { GameService } from '../../../../services/game.service';
import { QuestionService } from '../../../../services/question-service.service';
import { SupabaseService } from '../../../../services/supabase.service';
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

  // Cache dla klubów z Supabase
  private clubsCache: any[] = [];

  gridData: any = null;
  cellStatus: boolean[][] = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];
  showMissing: boolean = false;
  gameFinished = false;

  // Punktacja
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
    private pointsService: PointsService,
    public supabase: SupabaseService // Wstrzyknięcie serwisu Supabase
  ) {}

  async ngOnInit() {
    // 1. Pobieramy listę klubów z bazy do lokalnego cache
    try {
      const { data } = await this.supabase.getClubs();
      this.clubsCache = data || [];
    } catch (err) {
      console.error('Błąd podczas ładowania klubów z Supabase:', err);
    }

    // 2. Pobieramy aktualną drużynę z GameState
    this.gameStateService.teams$.pipe(takeUntil(this.destroy$)).subscribe((teams) => {
      const activeTeamName = this.gameService.getCurrentTeam();
      const team = teams.find((t) => t.name === activeTeamName) || teams[0];

      if (team) {
        this.currentTeam = {
          ...team,
          calculatedPoints: 0,
        };
      }
    });

    // 3. Subskrypcja pytania (planszy)
    this.questionService.question$.pipe(takeUntil(this.destroy$)).subscribe((q) => {
      if (q && q.question === 'Football Grid' && q.answers?.[0]?.value) {
        try {
          this.gridData = JSON.parse(q.answers[0].value);
          this.resetGrid();
        } catch (e) {
          console.error('Błąd parsowania planszy:', e);
        }
      }
    });
  }

  /**
   * Pobiera informacje o klubie (nazwa, logo) z bazy Supabase
   */
  getHeaderInfo(label: string) {
    if (!label) return { name: '', logo: '' };

    // Szukamy w cache po nazwie lub fragmencie ścieżki pliku
    const club = this.clubsCache.find(
      (c) =>
        c.name.toLowerCase() === label.toLowerCase() ||
        c.file_name.toLowerCase().includes(label.toLowerCase())
    );

    if (club) {
      return {
        name: club.name,
        logo: `${this.supabase.STORAGE_URL}footballCrestes/${club.file_name}`,
      };
    }

    // Fallback: jeśli nie ma w bazie, zwracamy nazwę i obrazek "no-image"
    return {
      name: label,
      logo: `${this.supabase.STORAGE_URL}footballCrestes/no-image.png`,
    };
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

  public triggerTimeoutError(): void {
    this.revealMissing();
  }

  revealMissing() {
    if (this.gameFinished) return;

    this.showMissing = true;
    this.gameFinished = true;
    this.calculateScore();

    if (this.currentTeam) {
      this.pointsService.setPoints(this.earnedPoints);
      this.gameService.setCurrentTeam(this.currentTeam.name);
    }
  }

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
}
