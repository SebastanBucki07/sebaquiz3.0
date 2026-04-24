import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintsFormComponent } from './hints-form.component';

describe('HintsFormComponent', () => {
  let component: HintsFormComponent;
  let fixture: ComponentFixture<HintsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HintsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HintsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
