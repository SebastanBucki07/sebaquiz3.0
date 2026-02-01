import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {QuestionService} from '../../../../shared/question-service.service';
import {Observable} from 'rxjs';
import {Question} from '../../../../shared/questions/question.interface';
import {AnswerButtonsComponent} from './answer-buttons/answer-buttons.component';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    AnswerButtonsComponent,
  ],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css'
})
export class AnswerComponent implements OnInit {

  @Output() correct = new EventEmitter<void>();
  @Output() wrong = new EventEmitter<void>();
  @Output() half = new EventEmitter<void>();

  showAnswerButtons = false;

  question$!: Observable<Question | null>;

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.question$ = this.questionService.question$;
  }

  revealAnswer(index: number) {
    this.questionService.revealAnswer(index);

    // pobieramy aktualne pytanie
    this.question$.subscribe(currentQuestion => {
      if (!currentQuestion) return;

      const revealed = currentQuestion.revealedAnswers ?? [];
      const total = currentQuestion.answers.length;

      // pokaż przyciski dopiero gdy wszystkie odpowiedzi są odsłonięte
      if (revealed.length === total) {
        this.showAnswerButtons = true;
      }
    }).unsubscribe(); // od razu odsubskrybowanie, bo chcemy tylko jednorazowo sprawdzić
  }


  onHalf() {
    this.half.emit();
  }

}
