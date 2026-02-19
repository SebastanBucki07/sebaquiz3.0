import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeCategoryComponent } from './tic-tac-toe-category.component';

describe('TicTacToeCategoryComponent', () => {
  let component: TicTacToeCategoryComponent;
  let fixture: ComponentFixture<TicTacToeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicTacToeCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
