import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseCategoryComponent } from './choose-category.component';
import { GameService } from '../../services/game.service';
import { Subject } from 'rxjs';
import { CATEGORY_LIST } from '../../shared/models/category/categoryList';

describe('ChooseCategoryComponent', () => {
  let component: ChooseCategoryComponent;
  let fixture: ComponentFixture<ChooseCategoryComponent>;
  let gameServiceSpy: any; // Używamy any dla ułatwienia konfiguracji property
  let resetSubject: Subject<void>;

  beforeEach(async () => {
    resetSubject = new Subject<void>();

    // Tworzymy mocka z poprawnym przypisaniem Observable
    gameServiceSpy = {
      notifyDataChanged: jasmine.createSpy('notifyDataChanged'),
      reset$: resetSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [ChooseCategoryComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy }
      ]
    }).compileComponents();

    localStorage.clear();
    fixture = TestBed.createComponent(ChooseCategoryComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Nie wywołuj tego tutaj, wywołamy w konkretnych testach
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load all categories from CATEGORY_LIST on init if localStorage is empty', () => {
    fixture.detectChanges();
    expect(component.availableCategories.length).toBe(CATEGORY_LIST.length);
    expect(component.selectedCategories.length).toBe(0);
  });

  it('should move category from available to selected when addCategory is called', () => {
    fixture.detectChanges();
    const categoryToAdd = CATEGORY_LIST[0];

    component.addCategory(categoryToAdd);

    expect(component.selectedCategories).toContain(categoryToAdd);
    expect(component.availableCategories).not.toContain(categoryToAdd);
    expect(gameServiceSpy.notifyDataChanged).toHaveBeenCalled();
  });

  it('should move category back to available when removeCategory is called', () => {
    fixture.detectChanges();
    const category = CATEGORY_LIST[0];

    component.addCategory(category); // Najpierw dodajemy
    component.removeCategory(category); // Potem usuwamy

    expect(component.selectedCategories).not.toContain(category);
    expect(component.availableCategories).toContain(category);
  });

  it('should save to localStorage when categories change', () => {
    fixture.detectChanges();
    const category = CATEGORY_LIST[0];

    component.addCategory(category);

    const saved = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
    expect(saved.length).toBe(1);
    expect(saved[0].id).toBe(category.id);
  });

  it('should add all categories when addAllCategories is called', () => {
    fixture.detectChanges();
    component.addAllCategories();

    expect(component.selectedCategories.length).toBe(CATEGORY_LIST.length);
    expect(component.availableCategories.length).toBe(0);
  });

  it('should remove all categories when removeAllCategories is called', () => {
    fixture.detectChanges();
    component.addAllCategories(); // Najpierw dodaj wszystkie
    component.removeAllCategories(); // Potem usuń wszystkie

    expect(component.selectedCategories.length).toBe(0);
    expect(component.availableCategories.length).toBe(CATEGORY_LIST.length);
  });

  it('should reset state when gameService.reset$ emits', () => {
    fixture.detectChanges(); // Odpala ngOnInit i subskrypcję

    // 1. Ustawiamy stan początkowy (dodajemy kategorię)
    const testCategory = CATEGORY_LIST[0];
    component.addCategory(testCategory);

    expect(component.selectedCategories.length).toBe(1); // Sprawdzenie czy dodano

    // 2. Emitujemy sygnał resetu
    resetSubject.next();

    // 3. Weryfikujemy czy stan wrócił do zera
    expect(component.selectedCategories.length).withContext('Selected categories should be cleared').toBe(0);
    expect(component.availableCategories.length).withContext('All categories should be available again').toBe(CATEGORY_LIST.length);
  });

  it('should load categories from localStorage on init', () => {
    const mockSelected = [CATEGORY_LIST[0]];
    localStorage.setItem('selectedCategories', JSON.stringify(mockSelected));

    fixture.detectChanges(); // Wywoła ngOnInit i loadCategories

    expect(component.selectedCategories.length).toBe(1);
    expect(component.selectedCategories[0].id).toBe(CATEGORY_LIST[0].id);
    expect(component.availableCategories.length).toBe(CATEGORY_LIST.length - 1);
  });
});
