import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../../services/question-service.service';
import { Question } from '../../../../shared/questions/question.interface';
import { TipsComponent } from '../question/tips/tips.component';
import { Hint } from '../../../../shared/models/category/hint.interface';
import { CommonQuestionComponent } from '../common-question/common-question.component';

@Component({
  selector: 'app-photo-fragments-category',
  standalone: true,
  imports: [CommonModule, TipsComponent],
  templateUrl: './photo-fragments-category.component.html',
  styleUrl: './photo-fragments-category.component.css',
})
export class PhotoFragmentsCategoryComponent extends CommonQuestionComponent {
  public tiles: boolean[] = [];
  private hintStep = 0;

  constructor(questionService: QuestionService) {
    super(questionService);
    this.resetGrid();
  }

  override onQuestionChange(q: Question | null): void {
    if (!q) return;
    this.resetGrid();
    this.hintStep = 0;
  }

  override revealAll(): void {
    this.tiles = this.tiles.map(() => true);
  }

  override onHintUsed(hint: Hint): void {
    super.onHintUsed(hint);

    this.hintStep++;
    const tilesToReveal = Number(hint.content);

    if (!isNaN(tilesToReveal) && tilesToReveal > 0) {
      this.revealRandom(tilesToReveal);
    }
  }

  private revealRandom(count: number): void {
    const hiddenIndexes = this.tiles.map((val, i) => (!val ? i : -1)).filter((i) => i !== -1);

    const innerIndexes = hiddenIndexes.filter((index) => {
      const isTop = index < 10;
      const isBottom = index >= 90;
      const isLeft = index % 10 === 0;
      const isRight = index % 10 === 9;
      return !isTop && !isBottom && !isLeft && !isRight;
    });

    let pool = innerIndexes.length > 0 ? innerIndexes : hiddenIndexes;

    for (let i = 0; i < count && pool.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const tileIndex = pool[randomIndex];
      this.tiles[tileIndex] = true;
      pool.splice(randomIndex, 1);

      if (pool.length === 0 && innerIndexes.length > 0) {
        pool = this.tiles.map((val, i) => (!val ? i : -1)).filter((i) => i !== -1);
      }
    }
  }

  private resetGrid(): void {
    this.tiles = Array(100).fill(false);
  }

  public getImageSrc(question: Question | null): string {
    if (!question?.question) return '';
    return question.question.startsWith('http') ? question.question : '/' + question.question;
  }
}
