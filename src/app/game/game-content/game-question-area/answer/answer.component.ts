import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { QuestionService } from '../../../../services/question-service.service';
import { Observable, Subscription } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';
import { AnswerButtonsComponent } from './answer-buttons/answer-buttons.component';
import { AnswerItem } from '../../../../shared/models/answers/answerItem.interface';
import { getClubNameByFile } from '../../../../shared/mappers/clubMapper';
import { MATERIAL_IMPORTS } from '../../../../shared/material';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [AsyncPipe, CommonModule, AnswerButtonsComponent, MATERIAL_IMPORTS],
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
})
export class AnswerComponent implements OnInit, OnDestroy {
  @Output() correct = new EventEmitter<void>();
  @Output() wrong = new EventEmitter<void>();
  @Output() half = new EventEmitter<void>();

  question$!: Observable<Question | null>;
  showAnswerButtons = false;

  private subscription!: Subscription;

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.question$ = this.questionService.question$;

    this.subscription = this.question$.subscribe((currentQuestion) => {
      if (!currentQuestion) {
        this.showAnswerButtons = false;
        return;
      }

      currentQuestion.answers.forEach((answer: AnswerItem) => {
        if (answer.value.includes('.png')) {
          answer.value = getClubNameByFile(answer.value);
          console.log(`answer: ${answer}`);
        }
      });
      const revealed = currentQuestion.revealedAnswers ?? [];
      const total = currentQuestion.answers?.length ?? 0;

      this.showAnswerButtons = revealed.length === total;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  revealAnswer(index: number) {
    this.questionService.revealAnswer(index);
  }
}
