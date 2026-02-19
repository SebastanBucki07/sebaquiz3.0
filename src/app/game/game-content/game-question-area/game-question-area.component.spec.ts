import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameQuestionAreaComponent } from './game-question-area.component';

describe('GameQuestionAreaComponent', () => {
  let component: GameQuestionAreaComponent;
  let fixture: ComponentFixture<GameQuestionAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameQuestionAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameQuestionAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
