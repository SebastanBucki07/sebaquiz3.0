import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballGameCategoryComponent } from './football-game-category.component';

describe('FootballGameCategoryComponent', () => {
  let component: FootballGameCategoryComponent;
  let fixture: ComponentFixture<FootballGameCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootballGameCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootballGameCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
