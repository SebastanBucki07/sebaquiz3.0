import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritingCategoryComponent } from './writing-category.component';
import { QuestionService } from '../../../../services/question-service.service';
import { GameStateService } from '../../../../services/game-state.service';
import { GameService } from '../../../../services/game.service';
import { PointsService } from '../../../../services/points-service.service';
import { WritingGameCoreService } from '../../../../services/writting-game-core.service';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject, Subject } from 'rxjs';

fdescribe('WritingCategoryComponent', () => {
  let component: WritingCategoryComponent;
  let fixture: ComponentFixture<WritingCategoryComponent>;

  // Service Mocks
  let questionServiceMock: any;
  let gameStateServiceMock: any;
  let gameServiceMock: any;
  let pointsServiceMock: any;
  let gameCoreMock: any;

  const mockTeams = [
    { id: 1, name: 'Team A', points: 0 },
    { id: 2, name: 'Team B', points: 0 },
    { id: 3, name: 'Team C', points: 0 }
  ];

  const mockQuestion = {
    id: 1,
    question: 'Test?',
    answers: [{ value: 'Yes' }, { value: 'No' }],
    revealedAnswers: []
  };

  beforeEach(async () => {
    questionServiceMock = {
      question$: new BehaviorSubject(mockQuestion),
      revealAnswer: jasmine.createSpy('revealAnswer')
    };

    gameStateServiceMock = {
      teams$: of(mockTeams)
    };

    gameServiceMock = {
      setCurrentTeam: jasmine.createSpy('setCurrentTeam'),
      nextTeam: jasmine.createSpy('nextTeam'),
      reset$: new Subject<void>()
    };

    pointsServiceMock = {
      setPoints: jasmine.createSpy('setPoints')
    };

    gameCoreMock = {
      wrongFlash$: new BehaviorSubject(false),
      validateAnswer: jasmine.createSpy('validateAnswer'),
      triggerCorrectEffects: jasmine.createSpy('triggerCorrectEffects'),
      triggerWrongEffects: jasmine.createSpy('triggerWrongEffects'),
      calculateFinalScore: jasmine.createSpy('calculateFinalScore').and.returnValue(10)
    };

    await TestBed.configureTestingModule({
      imports: [WritingCategoryComponent],
      providers: [
        { provide: QuestionService, useValue: questionServiceMock },
        { provide: GameStateService, useValue: gameStateServiceMock },
        { provide: GameService, useValue: gameServiceMock },
        { provide: PointsService, useValue: pointsServiceMock },
        { provide: WritingGameCoreService, useValue: gameCoreMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { startPlayer: '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WritingCategoryComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // --- TURN ORDER TESTS ---

  it('should set the initial team based on the startPlayer URL parameter', () => {
    expect(component.currentTeamIndex).toBe(1);
    expect(component.currentTeam?.name).toBe('Team B');
  });

  it('should switch to the next team after a correct answer', () => {
    gameCoreMock.validateAnswer.and.returnValue(0);
    component.submitAnswer('Yes');

    expect(component.currentTeamIndex).toBe(2);
    expect(component.currentTeam?.name).toBe('Team C');
  });

  it('should wrap around to the first team (index 0) after the last team in the array', () => {
    component.currentTeamIndex = 2; // Set to the last team (Team C)
    gameCoreMock.validateAnswer.and.returnValue(0);
    component.submitAnswer('Yes');

    expect(component.currentTeamIndex).toBe(0);
    expect(component.currentTeam?.name).toBe('Team A');
  });

  // --- CHANCES AND ERRORS TESTS ---

  it('should decrease chances when a team gives a wrong answer', () => {
    const activeTeam = component.teams[1];
    const initialChances = activeTeam.chancesLeft;

    gameCoreMock.validateAnswer.and.returnValue(-1);
    component.submitAnswer('Wrong Answer');

    expect(activeTeam.chancesLeft).toBe(initialChances - 1);
    expect(activeTeam.mistakes).toBe(1);
  });

  it('should skip a team that has lost all its chances', () => {
    // Eliminate Team A (index 0)
    component.teams[0].mistakes = 3;
    component.teams[0].chancesLeft = 0;

    // Current team is Team C (index 2), give a correct answer
    component.currentTeamIndex = 2;
    gameCoreMock.validateAnswer.and.returnValue(0);
    component.submitAnswer('Yes');

    // Should skip Team A and set Team B (index 1)
    expect(component.currentTeamIndex).toBe(1);
    expect(component.currentTeam?.name).toBe('Team B');
  });

  it('should finish the game when only one team has chances left and makes a mistake', () => {
    // Setup: only Team C has chances left
    component.teams[0].mistakes = 3;
    component.teams[1].mistakes = 3;
    component.teams[2].mistakes = 2; // Team C's last chance

    component.currentTeamIndex = 2;
    gameCoreMock.validateAnswer.and.returnValue(-1);
    component.submitAnswer('Mistake');

    expect(component.gameFinished).toBe(true);
  });

  // --- SERVICE INTEGRATION TESTS ---

  it('should call service methods when the game finishes', () => {
    component.finishGame();
    expect(gameServiceMock.setCurrentTeam).toHaveBeenCalled();
    expect(gameServiceMock.nextTeam).toHaveBeenCalled();
    expect(pointsServiceMock.setPoints).toHaveBeenCalled();
  });

  it('should react to the reset signal from GameService', () => {
    // Simulate clicking "New Game" in the header
    gameServiceMock.reset$.next();

    // Verify reset logic (e.g., game marked as finished or state cleared)
    // expect(component.gameFinished).toBe(true);
  });
});
