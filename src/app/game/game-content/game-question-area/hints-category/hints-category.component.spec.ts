import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintsCategoryComponent } from './hints-category.component';

describe('HintsCategoryComponent', () => {
  let component: HintsCategoryComponent;
  let fixture: ComponentFixture<HintsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HintsCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HintsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
