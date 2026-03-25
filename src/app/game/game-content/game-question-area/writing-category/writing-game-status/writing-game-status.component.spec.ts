import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingGameStatusComponent } from './writing-game-status.component';

describe('GameStatusComponent', () => {
  let component: WritingGameStatusComponent;
  let fixture: ComponentFixture<WritingGameStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingGameStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritingGameStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
