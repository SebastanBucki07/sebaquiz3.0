import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { QuestionService } from '../../../../services/question-service.service';
import { Question } from '../../../../shared/questions/question.interface';
import {Observable, take} from 'rxjs';
import { GameStateService } from '../../../../services/game-state.service';
import { PointsService } from '../../../../services/points-service.service';
import { GameService } from '../../../../services/game.service';
import {
  areSimilar,
  normalizeText,
} from '../../../../shared/utils/text-logic';
import { playSound } from '../../../../shared/utils/audio-helper';
import { generateTeamColors } from '../../../../shared/utils/color-helper';
import { Team } from '../../../../shared/models/teams/team.interface';
import { TeamInWritingCategory } from '../../../../shared/models/teams/teamForWrittingCategory.interface';
import {MATERIAL_IMPORTS} from '../../../../shared/material';
import {WritingScoreBoardComponent} from './writing-score-board/writing-score-board.component';

@Component({
  selector: 'app-writing-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MATERIAL_IMPORTS,
    WritingScoreBoardComponent,
  ],
  templateUrl: './writing-category.component.html',
  styleUrls: ['./writing-category.component.css'],
})
export class WritingCategoryComponent implements OnInit {
  readonly MAX_CHANCES = 3;
  readonly MAX_POINTS = 10;

  question$!: Observable<Question | null>;
  question!: Question | null;

  teams: TeamInWritingCategory[] = [];
  currentTeamIndex = 0;
  winner: TeamInWritingCategory | null = null;
  inputValue = '';
  gameFinished = false;
  lastCorrectTeam: Team | null = null;
  remainingAnswers = 0;
  wrongFlash = false;
  answerOwners: { [key: number]: number } = {};

  constructor(
    private questionService: QuestionService,
    private gameStateService: GameStateService,
    private gameService: GameService,
    private pointsService: PointsService
  ) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    this.gameStateService.teams$.pipe(take(1)).subscribe((teams) => {
      const colors = generateTeamColors(teams.length);
      this.teams = teams.map((team, index) => ({
        ...team,
        mistakes: 0,
        chancesLeft: this.MAX_CHANCES,
        correctAnswers: 0,
        calculatedPoints: 0,
        color: colors[index],
      }));
      this.currentTeamIndex = 0;
    });

    // Subskrypcja pytania
    this.question$.subscribe((q) => {
      if (!q) return;
      this.question = q;

      // sortowanie odpowiedzi alfabetycznie
      this.question.answers = [...q.answers].sort((a, b) =>
        a.value.toLowerCase().localeCompare(b.value.toLowerCase())
      );

      this.remainingAnswers = this.question.answers.length;
    });
  }

  get currentTeam(): TeamInWritingCategory | null {
    return this.teams.length > 0 ? this.teams[this.currentTeamIndex] : null;
  }

  get activeTeamId(): number | null {
    return this.currentTeam?.id ?? null;
  }

  getOwnerName(answerIndex: number): string | null {
    const ownerId = this.answerOwners[answerIndex];
    if (!ownerId) return null;

    const foundTeam = this.teams.find((team) => team.id === ownerId);
    return foundTeam ? foundTeam.name : null;
  }

  getAnswerColor(index: number): string {
    const ownerId = this.answerOwners[index];
    if (!ownerId) return '';

    const team = this.teams.find((p) => p.id === ownerId);
    return team ? team.color : '';
  }

  submitAnswer(): void {
    // Dodaj sprawdzenie, czy odpowiedź nie została już odkryta przez kogoś innego wcześniej
    if (!this.question || !this.inputValue.trim() || this.gameFinished || !this.currentTeam) return;

    const normalizedInput = normalizeText(this.inputValue);

    // Szukamy indeksu odpowiedzi
    let answerIndex = this.question.answers.findIndex(
      (a) => normalizeText(a.value) === normalizedInput
    );

    if (answerIndex === -1) {
      answerIndex = this.question.answers.findIndex((a) => areSimilar(normalizedInput, a.value));
    }

    // Sprawdzamy czy odpowiedź istnieje i czy NIE została jeszcze odkryta
    if (answerIndex >= 0) {
      const alreadyRevealed = this.isRevealed(answerIndex);

      if (!alreadyRevealed) {
        // 1. Odkrywamy w serwisie
        this.questionService.revealAnswer(answerIndex);

        // 2. Przypisujemy właściciela (UŻYWAMY ID DRUŻYNY)
        this.answerOwners[answerIndex] = this.currentTeam.id;

        // 3. Dodajemy punkty i statystyki do AKTUALNEJ DRUŻYNY
        this.currentTeam.correctAnswers++;

        const totalAnswers = this.question.answers.length || 1;
        this.currentTeam.calculatedPoints = Math.ceil(
          (this.currentTeam.correctAnswers / totalAnswers) * this.MAX_POINTS
        );

        playSound('sounds/1z10dobrzee.mp3');

        this.inputValue = '';

        // 4. Sprawdzamy czy to koniec pytania, jeśli nie - następny gracz
        if (this.getRemaining() === 0) {
          this.finishGame();
        } else {
          this.nextTeam();
        }
        return;
      }
    }

    // Jeśli tu dotarliśmy, to znaczy że odpowiedź była błędna lub już odkryta
    this.handleMistake();
    this.inputValue = '';
  }

  handleMistake(): void {
    const team = this.currentTeam!;
    team.mistakes++;
    team.chancesLeft--;

    playSound('sounds/1z10zle.mp3');
    this.triggerWrongFlash();

    if (team.mistakes >= this.MAX_CHANCES) {
      const aliveTeams = this.teams.filter((p) => p.mistakes < this.MAX_CHANCES);

      if (aliveTeams.length <= 1) {
        this.revealAllAnswers();
        this.finishGame();
        return;
      }

      this.nextTeam();
      return;
    }

    this.nextTeam();
  }

  triggerWrongFlash(): void {
    this.wrongFlash = true;
    setTimeout(() => (this.wrongFlash = false), 400);
  }

  getRemaining(): number {
    const revealedCount = this.question?.revealedAnswers?.length ?? 0;
    const totalCount = this.question?.answers?.length ?? 0;
    return totalCount - revealedCount;
  }

  nextTeam(): void {
    const aliveTeams = this.teams.filter((p) => p.mistakes < this.MAX_CHANCES);
    if (aliveTeams.length <= 1) {
      this.finishGame();
      return;
    }

    let next = this.currentTeamIndex;
    let attempts = 0;

    do {
      next = (next + 1) % this.teams.length;
      attempts++;
    } while (this.teams[next].mistakes >= this.MAX_CHANCES && attempts <= this.teams.length);

    this.currentTeamIndex = next;
  }

  revealAllAnswers(): void {
    if (!this.question) return;
    this.question.answers?.forEach((_, index) => this.questionService.revealAnswer(index));
  }

  checkIfAllRevealed(): void {
    if (!this.question) return;

    if (this.question.revealedAnswers?.length === this.question.answers?.length) {
      this.finishGame();
    } else {
      this.nextTeam();
    }
  }

  finishGame(): void {
    this.gameFinished = true;
    if (!this.question) return;

    const totalAnswers = this.question.answers?.length ?? 0;
    if (totalAnswers === 0) return;

    // Obliczamy punkty dla każdej drużyny/gracza
    this.teams.forEach((team) => {
      const ratio = team.correctAnswers / totalAnswers;
      team.calculatedPoints = Math.ceil(ratio * this.MAX_POINTS);
    });

    this.teams = [...this.teams];

    // Wyłonienie zwycięzcy
    const sorted = [...this.teams].sort((a, b) => {
      if (b.correctAnswers === a.correctAnswers) {
        return b.chancesLeft - a.chancesLeft;
      }
      return b.correctAnswers - a.correctAnswers;
    });

    this.winner = sorted[0] || null;

    if (this.winner) {
      // ustaw aktualną drużynę na zwycięzcę
      this.gameService.setCurrentTeam(this.winner.name);

      // ustaw dostępne punkty na obiekt zwycięzcy
      this.pointsService.setPoints(this.winner.calculatedPoints ?? 0);
    }
  }

  isRevealed(index: number): boolean {
    return this.question?.revealedAnswers?.includes(index) ?? false;
  }
}
