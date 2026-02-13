import {Hint} from '../../../../shared/category/category.interface';
import {QuestionService} from '../../../../shared/question-service.service';
import {distinctUntilChanged, map, Observable, Subscription} from 'rxjs';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TipsComponent} from '../question/tips/tips.component';
import {Question} from '../../../../shared/questions/question.interface';


@Component({
  selector: 'app-photo-fragments-category',
  standalone: true,
  imports: [CommonModule, TipsComponent],
  templateUrl: './photo-fragments-category.component.html',
  styleUrl: './photo-fragments-category.component.css'
})
export class PhotoFragmentsCategoryComponent implements OnDestroy, OnInit {
  question$!: Observable<Question | null>;
  @Output() hintUsed = new EventEmitter<Hint>();

  hints: Hint[] = [];
  tiles: boolean[] = [];
  private sub?: Subscription;
  private revealSteps = [10, 10, 10];


  private hintStep = 0; // 🔥 licznik użytych hintów

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;
    this.tiles = Array(100).fill(false);

    // 🔹 Subskrypcja zmian pytania (tylko ID)
    this.sub = this.questionService.question$
      .pipe(
        map(q => q?.id),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const q = this.questionService.getCurrentQuestion();
        if (!q) return;
        this.hints = q.hints ?? [];
        this.resetGrid();
        this.hintStep = 0;
      });

    this.questionService.question$
      .pipe(
        map(q => q?.revealedAnswers?.length ?? 0),
        distinctUntilChanged()
      )
      .subscribe(count => {
        if (count > 0) {
          this.revealAll();
        }
      });

  }




  onHintUsed(hint: Hint): void {
    this.hintUsed.emit(hint);

    if (this.hintStep < this.revealSteps.length) {
      this.revealRandom(this.revealSteps[this.hintStep]);
      this.hintStep++;
    }
  }

  private revealRandom(count: number): void {
    const hiddenIndexes = this.tiles
      .map((val, i) => (!val ? i : -1))
      .filter(i => i !== -1);

    for (let i = 0; i < count && hiddenIndexes.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * hiddenIndexes.length);
      const tileIndex = hiddenIndexes[randomIndex];

      this.tiles[tileIndex] = true;
      hiddenIndexes.splice(randomIndex, 1);
    }
  }

  private resetGrid(): void {
    this.tiles = Array(100).fill(false);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private revealAll(): void {
    this.tiles = this.tiles.map(() => true);
  }

}
