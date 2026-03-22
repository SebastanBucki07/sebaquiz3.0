import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { QuestionService } from '../services/question-service.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // Mocki serwisów
  let routerSpy: jasmine.SpyObj<Router>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>;

  beforeEach(async () => {
    // Tworzymy szpiegów (spies), aby nie używać prawdziwych serwisów
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    gameServiceSpy = jasmine.createSpyObj('GameService', ['resetGame', 'setCurrentTeam']);
    questionServiceSpy = jasmine.createSpyObj('QuestionService', ['resetQuestions']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent], // Standalone component
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: GameService, useValue: gameServiceSpy },
        { provide: QuestionService, useValue: questionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('newGame', () => {
    it('should reset game and questions, then navigate to pregame', () => {
      // Przygotowanie (Arrange): Czyścimy localStorage
      localStorage.clear();

      // Działanie (Act)
      component.newGame();

      // Weryfikacja (Assert)
      expect(gameServiceSpy.resetGame).toHaveBeenCalled();
      expect(questionServiceSpy.resetQuestions).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/pregame']);
    });

    it('should set current team if teams exist in localStorage', () => {
      // Przygotowanie (Arrange)
      const mockTeams = [{ name: 'Team Rocket' }, { name: 'Ash Ketchum' }];
      localStorage.setItem('teams', JSON.stringify(mockTeams));

      // Działanie (Act)
      component.newGame();

      // Weryfikacja (Assert)
      expect(gameServiceSpy.setCurrentTeam).toHaveBeenCalledWith('Team Rocket');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/pregame']);
    });

    it('should NOT set current team if localStorage is empty', () => {
      // Przygotowanie
      localStorage.setItem('teams', JSON.stringify([]));

      // Działanie
      component.newGame();

      // Weryfikacja
      expect(gameServiceSpy.setCurrentTeam).not.toHaveBeenCalled();
    });
  });
});
