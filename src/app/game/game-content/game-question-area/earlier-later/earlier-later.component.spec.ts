import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlierLaterComponent } from './earlier-later.component';

describe('EarlierLaterComponent', () => {
  let component: EarlierLaterComponent;
  let fixture: ComponentFixture<EarlierLaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarlierLaterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarlierLaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
