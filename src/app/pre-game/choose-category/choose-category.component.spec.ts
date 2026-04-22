import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChooseCategoryComponent } from './choose-category.component';
import { GameService } from '../../services/game.service';
import { SupabaseService } from '../../services/supabase.service';
import { Subject} from 'rxjs';

describe('ChooseCategoryComponent', () => {
  let component: ChooseCategoryComponent;
  let fixture: ComponentFixture<ChooseCategoryComponent>;
  let gameServiceSpy: jasmine.SpyObj<GameService>;
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;
  let resetSubject: Subject<void>;

  const mockCategoriesFromDb = [
    { id: 1, name: 'Kategoria 1', category_types: { name: 'Typ A' }, base_points: 100, icon: 'star', color: '#ff0000' },
    { id: 2, name: 'Kategoria 2', category_types: { name: 'Typ A' }, base_points: 200, icon: 'heart', color: '#00ff00' },
    { id: 3, name: 'Samotna', category_types: { name: 'Typ B' }, base_points: 300, icon: 'help', color: '#0000ff' }
  ];

  beforeEach(async () => {
    resetSubject = new Subject<void>();
    gameServiceSpy = jasmine.createSpyObj('GameService', ['notifyDataChanged'], {
      reset$: resetSubject.asObservable()
    });

    // Mockujemy getCategories tak, aby zwracał Promise (async/await w komponencie)
    supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', ['getCategories']);
    supabaseServiceSpy.getCategories.and.returnValue(Promise.resolve(mockCategoriesFromDb));

    await TestBed.configureTestingModule({
      imports: [ChooseCategoryComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy },
        { provide: SupabaseService, useValue: supabaseServiceSpy }
      ]
    }).compileComponents();

    localStorage.clear();
    fixture = TestBed.createComponent(ChooseCategoryComponent);
    component = fixture.componentInstance;
  });

  it('should load categories from Supabase on init', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick(); // Czekamy na rozwiązanie Promise z Supabase

    expect(supabaseServiceSpy.getCategories).toHaveBeenCalled();
    expect(component.allCategories.length).toBe(3);
    expect(component.isLoading).toBeFalse();
  }));

  it('should group single categories into "inne"', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Typ A ma 2 kategorie -> zostaje jako "typ a"
    // Typ B ma 1 kategorię -> powinien trafić do "inne" (zgodnie z Twoją nową logiką)
    const inneGroup = component.categoryGroups.find(g => g.typeName === 'inne');
    const typAGroup = component.categoryGroups.find(g => g.typeName === 'typ a');

    expect(typAGroup).toBeTruthy();
    expect(typAGroup?.categories.length).toBe(2);
    expect(inneGroup).toBeTruthy();
    expect(inneGroup?.categories.some(c => c.name === 'Samotna')).toBeTrue();
  }));

  it('should add category to selectedCategories and save to localStorage', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const cat = component.allCategories[0];
    component.addCategory(cat);

    expect(component.selectedCategories).toContain(cat);
    expect(gameServiceSpy.notifyDataChanged).toHaveBeenCalled();

    const saved = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
    expect(saved[0].id).toBe(cat.id);
  }));

  it('should not add the same category twice', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const cat = component.allCategories[0];
    component.addCategory(cat);
    component.addCategory(cat);

    expect(component.selectedCategories.length).toBe(1);
  }));

  it('should remove category when removeCategory is called', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const cat = component.allCategories[0];
    component.addCategory(cat);
    component.removeCategory(cat);

    expect(component.selectedCategories).not.toContain(cat);
    expect(component.selectedCategories.length).toBe(0);
  }));

  it('should add all categories when addAllCategories is called', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.addAllCategories();

    expect(component.selectedCategories.length).toBe(component.allCategories.length);
  }));

  it('should reset selected categories when gameService.reset$ emits', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.addAllCategories();
    expect(component.selectedCategories.length).toBe(3);

    resetSubject.next(); // Emitujemy reset

    expect(component.selectedCategories.length).toBe(0);
  }));

  it('should load selected categories from storage on init', fakeAsync(() => {
    // Symulujemy dane w storage przed startem
    const mockSelected = [{ id: 1, name: 'Kategoria 1', basePoints: 100 }];
    localStorage.setItem('selectedCategories', JSON.stringify(mockSelected));

    fixture.detectChanges(); // ngOnInit wywołuje loadSelectedFromStorage
    tick();

    expect(component.selectedCategories.length).toBe(1);
    expect(component.selectedCategories[0].id).toBe(1);
  }));

  it('should calculate total points correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.addCategory(component.allCategories[0]); // 100 pkt
    component.addCategory(component.allCategories[1]); // 200 pkt

    expect(component.getTotalPoints()).toBe(300);
  }));
});
