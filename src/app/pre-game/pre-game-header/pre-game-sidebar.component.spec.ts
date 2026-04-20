import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameSidebarComponent } from './pre-game-sidebar.component';

describe('PreGameHeaderComponent', () => {
  let component: PreGameSidebarComponent;
  let fixture: ComponentFixture<PreGameSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreGameSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreGameSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
