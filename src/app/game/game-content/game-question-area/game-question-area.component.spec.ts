import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameQuestionAreaComponent } from './game-question-area.component';
import { ActivatedRoute, Router } from '@angular/router';
import {of, Subject} from 'rxjs';
import { QuestionService } from '../../../services/question-service.service';
import { GameService } from '../../../services/game.service';
import { PointsService } from '../../../services/points-service.service';
import { Hint } from '../../../shared/models/category/hint.interface';

describe('GameQuestionAreaComponent', () => {
  let component: GameQuestionAreaComponent;
  let fixture: ComponentFixture<GameQuestionAreaComponent>;

  // Mocki serwisów
  let mockRouter: jasmine.SpyObj<Router>;
  let mockQuestionService: jasmine.SpyObj<QuestionService>;
  let mockGameService: jasmine.SpyObj<GameService>;
  let mockPointsService: jasmine.SpyObj<PointsService>;

  // Dane testowe (zamiast CATEGORY_LIST)
  const mockCategory = {
    id: 1,
    name: 'Astronomia',
    type: 'Nauka',
    basePoints: 100,
    icon: 'star',
    color: '#3b82f6'
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockGameService = jasmine.createSpyObj('GameService', ['nextTeam']);
    mockQuestionService = jasmine.createSpyObj('QuestionService', ['loadRandomQuestion', 'revealAnswer'], {
      question$: of(null)
    });
    mockPointsService = jasmine.createSpyObj('PointsService', [
      'setPoints',
      'getAvailablePoints',
      'awardPointsToCurrentTeam',
      'applyHintPenalty'
    ]);

    // Symulujemy localStorage
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'selectedCategories') {
        return JSON.stringify([mockCategory]);
      }
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [GameQuestionAreaComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: GameService, useValue: mockGameService },
        { provide: PointsService, useValue: mockPointsService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'type') return mockCategory.type;
                if (key === 'name') return mockCategory.name;
                return null;
              }
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameQuestionAreaComponent);
    component = fixture.componentInstance;

    // Ustawiamy domyślny zwrot dla punktów
    mockPointsService.getAvailablePoints.and.returnValue(100);

    fixture.detectChanges(); // ngOnInit
  });

  it('should load category from localStorage and call initial services', () => {
    expect(component.currentCategory).toEqual(mockCategory as any);
    expect(mockPointsService.setPoints).toHaveBeenCalledWith(mockCategory.basePoints);
    expect(mockQuestionService.loadRandomQuestion).toHaveBeenCalledWith(mockCategory.type, mockCategory.name);
  });

  it('should calculate points correctly including hint penalties', () => {
    const mockHint: Hint = { id: 'h1', label: 'Podpowiedź', penaltyPercent: 20, content: '...' };

    // Symulujemy użycie podpowiedzi
    component.onHintUsed(mockHint);

    // Dostępne: 100, kara: 20% -> 80
    expect(component.currentPoints).toBe(80);
    expect(mockPointsService.applyHintPenalty).toHaveBeenCalledWith(mockHint);
  });

  it('should navigate to game and switch team on correct answer', () => {
    component.correct();

    expect(mockPointsService.awardPointsToCurrentTeam).toHaveBeenCalled();
    expect(mockGameService.nextTeam).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('should award half points and navigate on half()', () => {
    // currentPoints zwraca 100
    component.half();

    expect(mockPointsService.awardPointsToCurrentTeam).toHaveBeenCalledWith(50);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('should reset hints and navigate on wrong answer', () => {
    component.usedHints = [{ id: '1' } as any];

    component.wrong();

    expect(component.usedHints.length).toBe(0);
    expect(mockGameService.nextTeam).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('should handle onActivate and subscribe to hintUsed', () => {
    const hintEmitter = new Subject<Hint>();
    const mockChild = { hintUsed: hintEmitter.asObservable() };
    const mockHint: Hint = { id: 'h2', label: 'H2', penaltyPercent: 10, content: '' };

    component.onActivate(mockChild);
    hintEmitter.next(mockHint);

    expect(component.usedHints).toContain(mockHint);
    expect(mockPointsService.applyHintPenalty).toHaveBeenCalledWith(mockHint);
  });

  it('should not allow the same hint twice', () => {
    const mockHint: Hint = { id: 'h1', label: 'H1', penaltyPercent: 10, content: '' };

    component.onHintUsed(mockHint);
    component.onHintUsed(mockHint);

    expect(component.usedHints.length).toBe(1);
    expect(mockPointsService.applyHintPenalty).toHaveBeenCalledTimes(1);
  });
});
