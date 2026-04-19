import { Directive, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Hint } from '../../../../shared/models/category/hint.interface';
import { QuestionService } from '../../../../services/question-service.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Question } from '../../../../shared/questions/question.interface';

@Directive()
export abstract class CommonQuestionComponent implements OnInit, OnDestroy {
  @Output() hintUsed = new EventEmitter<Hint>();

  public question$!: Observable<Question | null>;
  public hints: Hint[] = [];
  protected destroy$ = new Subject<void>();

  constructor(protected questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    this.question$.pipe(takeUntil(this.destroy$)).subscribe((q) => {
      if (q) {
        this.hints = q.hints ?? [];
        this.onQuestionChange(q);
      }
    });

    this.question$
      .pipe(
        takeUntil(this.destroy$),
        map((q) => q?.revealedAnswers?.length ?? 0),
        distinctUntilChanged()
      )
      .subscribe((count) => {
        if (count > 0) this.revealAll();
      });
  }

  protected onQuestionChange(question: Question): void {}

  protected revealAll(): void {}

  public onHintUsed(hint: Hint): void {
    this.hintUsed.emit(hint);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
