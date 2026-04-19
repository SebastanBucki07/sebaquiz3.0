import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonQuestionComponent } from './common-question.component';
import { of } from 'rxjs';
import {QuestionService} from '../../../../services/question-service.service';

@Component({
  selector: 'app-test-common-question',
  standalone: true,
  template: ''
})
class TestHostComponent extends CommonQuestionComponent {
  constructor(questionService: QuestionService) {
    super(questionService);
  }

  override revealAll(): void {
  }
}

describe('CommonQuestionComponent (via TestHostComponent)', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let mockQuestionService: any;

  beforeEach(async () => {
    mockQuestionService = {
      question$: of(null)
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: QuestionService, useValue: mockQuestionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize question$ from service', (done) => {
    component.question$.subscribe(q => {
      expect(q).toBeNull();
      done();
    });
  });
});
