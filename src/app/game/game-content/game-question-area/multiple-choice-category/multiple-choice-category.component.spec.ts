import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceCategoryComponent } from './multiple-choice-category.component';

describe('MultipleChoiceCategoryComponent', () => {
  let component: MultipleChoiceCategoryComponent;
  let fixture: ComponentFixture<MultipleChoiceCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleChoiceCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
