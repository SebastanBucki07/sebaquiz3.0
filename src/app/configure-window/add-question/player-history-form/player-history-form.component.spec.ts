import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHistoryFormComponent } from './player-history-form.component';

describe('PlayerHistoryFormComponent', () => {
  let component: PlayerHistoryFormComponent;
  let fixture: ComponentFixture<PlayerHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerHistoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
