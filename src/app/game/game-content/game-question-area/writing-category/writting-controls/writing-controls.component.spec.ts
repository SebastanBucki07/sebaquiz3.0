import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingControlsComponent } from './writing-controls.component';

describe('WrittingControlsComponent', () => {
  let component: WritingControlsComponent;
  let fixture: ComponentFixture<WritingControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritingControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
