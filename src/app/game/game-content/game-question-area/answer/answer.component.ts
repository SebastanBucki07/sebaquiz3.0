import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { QuestionService } from '../../../../shared/question-service.service';
import { Observable, Subscription } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';
import { AnswerButtonsComponent } from './answer-buttons/answer-buttons.component';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [AsyncPipe, CommonModule, AnswerButtonsComponent],
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

    // Stała subskrypcja – przy każdej zmianie revealedAnswers sprawdzamy, czy wszystkie odpowiedzi ujawnione
    this.subscription = this.question$.subscribe((currentQuestion) => {
      if (!currentQuestion) {
        this.showAnswerButtons = false;
        return;
      }

      const revealed = currentQuestion.revealedAnswers ?? [];
      const total = currentQuestion.answers?.length ?? 0;

      this.showAnswerButtons = revealed.length === total;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Opcjonalnie – metoda do ręcznego ujawniania odpowiedzi
  revealAnswer(index: number) {
    this.questionService.revealAnswer(index);
    // Nie trzeba nic ustawiać showAnswerButtons – zrobi to subskrypcja
  }
}
