import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusicCategoryComponent } from './music-category.component';
import { QuestionService } from '../../../../services/question-service.service';
import { of } from 'rxjs';

describe('MusicCategoryComponent - YouTube Availability', () => {
  let component: MusicCategoryComponent;
  let fixture: ComponentFixture<MusicCategoryComponent>;

  const mockQuestionService = {
    question$: of({ id: 47, question: '7L3ZACjK3tI', answers: [] })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicCategoryComponent],
      providers: [
        { provide: QuestionService, useValue: mockQuestionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicCategoryComponent);
    component = fixture.componentInstance;

    (window as any).YT = {
      Player: class {
        constructor(id: string, config: any) {
          (this as any).config = config;
        }
        destroy() {}
        getDuration() { return 180; }
      }
    };
  });

  it('powinien ustawić videoError na true, gdy YouTube API zwróci błąd (np. film usunięty)', () => {
    // 1. Inicjujemy komponent
    fixture.detectChanges();

    // 2. Ręcznie wywołujemy callback onError (symulujemy odpowiedź YouTube o braku filmu)
    const playerInstance = (component as any).player;
    playerInstance.config.events.onError({ data: 100 });

    // 3. Sprawdzamy czy komponent zareagował
    expect(component.videoError).toBeTrue();
  });
});
