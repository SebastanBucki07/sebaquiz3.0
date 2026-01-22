import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameActualTeamComponent } from './game-actual-team.component';

describe('GameActualTeamComponent', () => {
  let component: GameActualTeamComponent;
  let fixture: ComponentFixture<GameActualTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameActualTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameActualTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
