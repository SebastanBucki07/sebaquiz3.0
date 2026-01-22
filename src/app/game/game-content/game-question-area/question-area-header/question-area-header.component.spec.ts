import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAreaHeaderComponent } from './question-area-header.component';

describe('QuestionAreaHeaderComponent', () => {
  let component: QuestionAreaHeaderComponent;
  let fixture: ComponentFixture<QuestionAreaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionAreaHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionAreaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
