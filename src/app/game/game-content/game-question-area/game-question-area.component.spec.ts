import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameQuestionAreaComponent } from './game-question-area.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { QuestionService } from '../../../services/question-service.service';
import { GameService } from '../../../services/game.service';
import { PointsService } from '../../../services/points-service.service';
import { CATEGORY_LIST } from '../../../shared/models/category/categoryList';
import { Hint } from '../../../shared/models/category/hint.interface';

describe('GameQuestionAreaComponent', () => {
  let component: GameQuestionAreaComponent;
  let fixture: ComponentFixture<GameQuestionAreaComponent>;

  // Mocki serwisów
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockQuestionService: any;
  let mockGameService: any;
  let mockPointsService: any;

  beforeEach(async () => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockGameService = { nextTeam: jasmine.createSpy('nextTeam') };
    mockQuestionService = {
      loadRandomQuestion: jasmine.createSpy('loadRandomQuestion'),
      revealAnswer: jasmine.createSpy('revealAnswer'),
      // DODAJ TO: udajemy strumień Observable, który emituje null na starcie
      question$: of(null)
    };
    mockPointsService = {
      setPoints: jasmine.createSpy('setPoints'),
      getAvailablePoints: jasmine.createSpy('getAvailablePoints').and.returnValue(100),
      awardPointsToCurrentTeam: jasmine.createSpy('awardPointsToCurrentTeam'),
      applyHintPenalty: jasmine.createSpy('applyHintPenalty')
    };

    // Symulacja parametrów URL (np. kategoria filmowa)
    const testCategory = CATEGORY_LIST[0];
    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => {
          if (key === 'type') return testCategory.type;
          if (key === 'name') return testCategory.name;
          return null;
        }
      })
    };

    await TestBed.configureTestingModule({
      imports: [GameQuestionAreaComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: QuestionService, useValue: mockQuestionService },
        { provide: GameService, useValue: mockGameService },
        { provide: PointsService, useValue: mockPointsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameQuestionAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Wywołuje ngOnInit
  });

  it('should subscribe to hintUsed when a component is activated', () => {
    // Tworzymy "udawany" komponent, który zostanie aktywowany w router-outlet
    const mockChildComponent = {
      hintUsed: of({ id: 'h1', label: 'Hint', penaltyPercent: 10, content: '...' })
    };

    // Szpiegujemy metodę onHintUsed, żeby sprawdzić czy zostanie wywołana
    spyOn(component, 'onHintUsed');

    // Symulujemy aktywację komponentu przez (activate) w HTML
    component.onActivate(mockChildComponent);

    expect(component.onHintUsed).toHaveBeenCalled();
  });

  it('should create and load initial question', () => {
    expect(component).toBeTruthy();
    expect(mockQuestionService.loadRandomQuestion).toHaveBeenCalled();
    expect(mockPointsService.setPoints).toHaveBeenCalled();
  });

  it('should navigate back to /game and change team on wrong()', () => {
    component.wrong();
    expect(mockGameService.nextTeam).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/game']);
    expect(component.usedHints.length).toBe(0);
  });

  it('should award points and navigate on correct()', () => {
    // Ustawiamy symulowane punkty
    mockPointsService.getAvailablePoints.and.returnValue(100);

    component.correct();

    expect(mockPointsService.awardPointsToCurrentTeam).toHaveBeenCalledWith(100);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('should calculate points correctly after using hints', () => {
    const mockHint: Hint = { id: '1', label: 'Hint 1', penaltyPercent: 20,content: 'Przykładowa treść podpowiedzi' };
    mockPointsService.getAvailablePoints.and.returnValue(100);

    component.onHintUsed(mockHint);

    // 100 pkt - 20% = 80 pkt
    expect(component.currentPoints).toBe(80);
    expect(mockPointsService.applyHintPenalty).toHaveBeenCalledWith(mockHint);
  });

  it('should award half points on half()', () => {
    mockPointsService.getAvailablePoints.and.returnValue(100);

    component.half();

    // Połowa ze 100 to 50
    expect(mockPointsService.awardPointsToCurrentTeam).toHaveBeenCalledWith(50);
    expect(mockGameService.nextTeam).toHaveBeenCalled();
  });

  it('should not add the same hint twice', () => {
    const mockHint: Hint = {
      id: '1',
      label: 'Hint 1',
      penaltyPercent: 20,
      content: 'test'
    };

    // Wywołujemy logikę bezpośrednio
    component.onHintUsed(mockHint);
    component.onHintUsed(mockHint);

    expect(component.usedHints.length).toBe(1);
    expect(mockPointsService.applyHintPenalty).toHaveBeenCalledTimes(1);
  });

  it('should call revealAnswer in QuestionService', () => {
    component.revealAnswer(2);
    expect(mockQuestionService.revealAnswer).toHaveBeenCalledWith(2);
  });
});
