import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoQuestionFormComponent } from './photo-question-form.component';

describe('PhotoQuestionFormComponent', () => {
  let component: PhotoQuestionFormComponent;
  let fixture: ComponentFixture<PhotoQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoQuestionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
