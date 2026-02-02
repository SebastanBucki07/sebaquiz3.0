import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Hint} from '../../../../shared/category/category.interface';
import {ActivatedRoute} from '@angular/router';
import {CATEGORY_LIST} from '../../../../shared/category/categoryList';
import {TipsComponent} from '../question/tips/tips.component';
import {QuestionService} from '../../../../shared/question-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-hints-category',
  templateUrl: './hints-category.component.html',
  imports: [
    TipsComponent
  ],
  styleUrls: ['./hints-category.component.css']
})
export class HintsCategoryComponent implements OnDestroy {
  @Output() hintUsed = new EventEmitter<Hint>();
  hints: Hint[] = [];
  private sub?: Subscription;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    // Subskrybujemy aktualne pytanie
    this.sub = this.questionService.question$.subscribe(q => {
      this.hints = q?.hints ?? [];
    });
  }

  onHintUsed(hint: Hint): void {
    console.log('FORWARDING HINT', hint);
    this.hintUsed.emit(hint);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
