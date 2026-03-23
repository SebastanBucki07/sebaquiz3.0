import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingScoreBoardComponent } from './writing-score-board.component';

describe('WrittingScoreBoardComponent', () => {
  let component: WritingScoreBoardComponent;
  let fixture: ComponentFixture<WritingScoreBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingScoreBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritingScoreBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
