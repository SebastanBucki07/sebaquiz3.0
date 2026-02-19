import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameHeaderComponent } from './pre-game-header.component';

describe('PreGameHeaderComponent', () => {
  let component: PreGameHeaderComponent;
  let fixture: ComponentFixture<PreGameHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreGameHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreGameHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
