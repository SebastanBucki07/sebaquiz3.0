import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingCategoryComponent } from './writing-category.component';

describe('WritingCategoryComponent', () => {
  let component: WritingCategoryComponent;
  let fixture: ComponentFixture<WritingCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WritingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
