import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameContentComponent } from './pre-game-content.component';

describe('PreGameContentComponent', () => {
  let component: PreGameContentComponent;
  let fixture: ComponentFixture<PreGameContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreGameContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreGameContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
