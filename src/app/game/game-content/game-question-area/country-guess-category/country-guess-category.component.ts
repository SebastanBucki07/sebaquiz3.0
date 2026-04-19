import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../../services/question-service.service';
import { Question } from '../../../../shared/questions/question.interface';
import { Hint } from '../../../../shared/models/category/hint.interface';
import { CommonQuestionComponent } from '../common-question/common-question.component';

@Component({
  selector: 'app-country-guess-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-guess-category.component.html',
  styleUrl: './country-guess-category.component.css',
})
export class CountryGuessCategoryComponent extends CommonQuestionComponent {
  public openedHintIds: Set<string> = new Set<string>();

  constructor(questionService: QuestionService) {
    super(questionService);
  }

  override onQuestionChange(q: Question | null): void {
    this.openedHintIds.clear();

    if (q && q.hints) {
      q.hints.forEach((hint) => {
        if (hint.label !== 'Stolica') {
          this.openedHintIds.add(hint.id);
        }
      });
    }
  }

  public showCapital(hint: Hint): void {
    if (this.openedHintIds.has(hint.id)) return;

    this.openedHintIds.add(hint.id);
    this.onHintUsed(hint); // Korzystamy z metody klasy bazowej
  }

  override revealAll(): void {
    this.hints.forEach((hint) => {
      this.openedHintIds.add(hint.id);
    });
  }

  public getIconClass(label: string): string {
    const icons: Record<string, string> = {
      Powierzchnia: 'icon-area',
      Populacja: 'icon-people',
      Granice: 'icon-borders',
      Region: 'icon-globe',
    };
    return icons[label] || 'icon-default';
  }
}
