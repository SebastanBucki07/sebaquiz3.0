import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrittingFormComponent } from './writting-form.component';

describe('WrittingFormComponent', () => {
  let component: WrittingFormComponent;
  let fixture: ComponentFixture<WrittingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrittingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrittingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
