import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerButtonsComponent } from './answer-buttons.component';

describe('AnswerButtonsComponent', () => {
  let component: AnswerButtonsComponent;
  let fixture: ComponentFixture<AnswerButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
