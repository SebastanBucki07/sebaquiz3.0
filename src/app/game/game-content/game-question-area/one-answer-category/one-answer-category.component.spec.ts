import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneAnswerCategoryComponent } from './one-answer-category.component';

describe('OneAnswerCategoryComponent', () => {
  let component: OneAnswerCategoryComponent;
  let fixture: ComponentFixture<OneAnswerCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneAnswerCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneAnswerCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
