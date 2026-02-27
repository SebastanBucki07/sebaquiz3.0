import {
  Component,
  OnInit
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {GameStateService, Team} from '../../../../shared/game-state.service';
import {GameService} from '../../../../shared/game.service';
import {PointsService} from '../../../../shared/points-service.service';
import {QuestionService} from '../../../../shared/question-service.service';
import {Observable} from 'rxjs';
import {Question} from '../../../../shared/questions/question.interface';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {footballPlayer, footballTeam} from '../../../../shared/answers/answerItem.interface';

interface Player extends Team {
  mistakes: number;
  chancesLeft: number;
  correctAnswers: number;
  calculatedPoints?: number;
  color: string;
}

@Component({
  selector: 'app-football-game-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
  ],
  templateUrl: './football-game-category.component.html',
  styleUrls: ['./football-game-category.component.css'],
})
export class FootballGameCategoryComponent implements OnInit {

  readonly MAX_CHANCES = 3;
  readonly MAX_POINTS = 10;

  firstRows: footballPlayer[][] = [];
  secondRows: footballPlayer[][] = [];
  firstSubstitutes: footballPlayer[] = [];
  secondSubstitutes: footballPlayer[] = [];

  question$!: Observable<Question | null>;
  question!: Question | null;

  players: Player[] = [];
  currentPlayerIndex = 0;
  winner: Player | null = null;
  inputValue = '';
  gameFinished = false;
  remainingAnswers = 0;

  private correctAudio = new Audio('/sounds/1z10dobrzee.mp3');
  private wrongAudio = new Audio('/sounds/1z10zle.mp3');

  constructor(
    private questionService: QuestionService,
    private gameStateService: GameStateService,
    private gameService: GameService,
    private pointsService: PointsService
  ) {}

  get activePlayerId(): number | null {
    return this.currentPlayer?.id ?? null;
  }

  ngOnInit(): void {

    this.question$ = this.questionService.question$;

    this.gameStateService.teams$.subscribe((teams) => {
      const colors = this.generateTeamColor(teams.length);

      this.players = teams.map((team, index) => ({
        ...team,
        mistakes: 0,
        chancesLeft: this.MAX_CHANCES,
        correctAnswers: 0,
        calculatedPoints: 0,
        color: colors[index],
      }));
    });

    this.question$.subscribe((q) => {
      if (!q) return;
      this.question = q;

      const football = q.answers?.[0]?.football;
      if (!football) return;

      // 🔥 Stwórz kopie piłkarzy, żeby nie nadpisywać oryginałów
      const clonePlayer = (p: footballPlayer) => ({ ...p, guessed: false, guessedBy: undefined });

      const cloneTeam = (team: footballTeam) => ({
        ...team,
        footballers: team.footballers.map(clonePlayer),
        substitutes: team.substitutes?.map(clonePlayer) ?? []
      });

      this.firstRows = this.buildRows(cloneTeam(football.firstTeam));
      this.secondRows = this.buildRows(cloneTeam(football.secondTeam), true);

      this.firstSubstitutes = cloneTeam(football.firstTeam).substitutes;
      this.secondSubstitutes = cloneTeam(football.secondTeam).substitutes;

      this.remainingAnswers = this.getAllPlayersCount();
    });
  }

  get currentPlayer(): Player | null {
    return this.players.length > 0 ? this.players[this.currentPlayerIndex] : null;
  }

  submitAnswer(): void {
    if (!this.currentPlayer || !this.inputValue.trim() || this.gameFinished) return;

    const needle = this.normalize(this.inputValue);

    // 1️⃣ wszystkie lokalne kopie graczy
    const allPlayers = [
      ...this.firstRows.flat(),
      ...this.secondRows.flat(),
      ...this.firstSubstitutes,
      ...this.secondSubstitutes
    ];

    // 2️⃣ szukamy gracza (najpierw dokładne dopasowanie, potem literówki)
    let player = allPlayers.find(p => !p.guessed && this.normalize(p.surname) === needle)
      || allPlayers.find(p => !p.guessed && this.areSimilar(needle, p.surname));

    if (player) {
      player.guessed = true;
      player.guessedBy = this.currentPlayer.name;

      this.currentPlayer.correctAnswers++;

      this.correctAudio.currentTime = 0;
      this.correctAudio.play();

      this.remainingAnswers--;

      this.refreshView();

      if (this.remainingAnswers <= 0) {
        this.finishGame();
      } else {
        this.nextPlayer();
      }
    } else {
      this.currentPlayer.mistakes++;
      this.currentPlayer.chancesLeft--;

      this.wrongAudio.currentTime = 0;
      this.wrongAudio.play();

      this.nextPlayer();
    }

    this.inputValue = '';
  }

  private refreshView(): void {
    this.firstRows = [...this.firstRows];
    this.secondRows = [...this.secondRows];
    this.firstSubstitutes = [...this.firstSubstitutes];
    this.secondSubstitutes = [...this.secondSubstitutes];
  }

  private finishGame(): void {
    this.gameFinished = true;

    const allPlayers = [
      ...this.firstRows.flat(),
      ...this.secondRows.flat(),
      ...this.firstSubstitutes,
      ...this.secondSubstitutes
    ];

    allPlayers.forEach(p => {
      if (!p.guessed) {
        p.guessed = true;
        p.guessedBy = undefined; // TS-friendly
      }
    });

    this.refreshView();

    // obliczenie punktów
    const total = this.getAllPlayersCount();
    this.players.forEach(p => {
      p.calculatedPoints = Math.ceil((p.correctAnswers / total) * this.MAX_POINTS);
    });

    const sorted = [...this.players].sort((a, b) => b.correctAnswers - a.correctAnswers);
    this.winner = sorted[0] ?? null;

    if (this.winner) {
      this.gameService.setCurrentTeam(this.winner.name);
      this.pointsService.setPoints(this.winner.calculatedPoints ?? 0);
    }
  }

  nextPlayer(): void {
    const alivePlayers = this.players.filter(
      (p) => p.mistakes < this.MAX_CHANCES
    );

    if (alivePlayers.length <= 1) {
      this.finishGame();
      return;
    }

    let next = this.currentPlayerIndex;
    let attempts = 0;

    do {
      next = (next + 1) % this.players.length;
      attempts++;
    } while (
      this.players[next].mistakes >= this.MAX_CHANCES &&
      attempts <= this.players.length
      );

    this.currentPlayerIndex = next;
  }

  private getAllPlayersCount(): number {
    const football = this.question?.answers?.[0]?.football;
    if (!football) return 0;

    return [
      ...football.firstTeam.footballers,
      ...(football.firstTeam.substitutes ?? []),
      ...football.secondTeam.footballers,
      ...(football.secondTeam.substitutes ?? [])
    ].length;
  }

  private buildRows(team: footballTeam, reverse = false): footballPlayer[][] {
    const players = [...team.footballers];
    const formation = team.formation.split('-').map(n => +n);
    const rows: footballPlayer[][] = [];

    formation.forEach(count => {
      rows.push(players.splice(0, count));
    });

    return reverse ? rows.reverse() : rows;
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private areSimilar(input: string, answer: string): boolean {
    const normInput = this.normalize(input);
    const normAnswer = this.normalize(answer);

    // dokładne dopasowanie zawsze
    if (normInput === normAnswer) return true;

    // sprawdzamy zamianę kolejności słów (Robert Lewandowski ↔ Lewandowski Robert)
    const inputWords = normInput
      .split(/[\s-]+/)
      .sort()
      .join(' ');
    const answerWords = normAnswer
      .split(/[\s-]+/)
      .sort()
      .join(' ');
    if (inputWords === answerWords) return true;

    // ustalamy maksymalną liczbę literówek
    const maxEdits = normAnswer.length >= 7 ? 3 : 1;

    // dopuszczamy literówki
    return this.levenshtein(normInput, normAnswer) <= maxEdits;
  }

  isCountryCode(c: string | undefined): boolean {
    return !!c && /^[A-Za-z]{2}$/.test(c.trim());
  }

  flagPngUrl(code: string): string {
    if (!code) return '';
    return `https://flagcdn.com/w80/${code.trim().toLowerCase()}.png`;
  }

  private generateTeamColor(count: number): string[] {
    const colors: string[] = [];
    const baseHue = Math.floor(Math.random() * 360);

    for (let i = 0; i < count; i++) {
      const hue = (baseHue + (360 / count) * i) % 360;
      colors.push(`hsl(${hue}, 75%, 45%)`);
    }
    return colors;
  }

  handleMistake(): void {
    const player = this.currentPlayer!;
    player.mistakes++;
    player.chancesLeft--;

    if (player.mistakes >= this.MAX_CHANCES) {
      const alivePlayers = this.players.filter(
        (p) => p.mistakes < this.MAX_CHANCES
      );

      if (alivePlayers.length <= 1) {
        this.finishGame();
        return;
      }

      this.nextPlayer();
      return;
    }

    this.nextPlayer();
  }

  // 🔹 Funkcja Levenshtein (do literówek)
  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
      new Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // usunięcie
          matrix[i][j - 1] + 1, // wstawienie
          matrix[i - 1][j - 1] + cost // zamiana
        );
      }
    }
    return matrix[a.length][b.length];
  }



}
