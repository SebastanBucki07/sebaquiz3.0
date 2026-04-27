import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicQuestionFormComponent } from './music-question-form.component';

describe('MusicQuestionFormComponent', () => {
  let component: MusicQuestionFormComponent;
  let fixture: ComponentFixture<MusicQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicQuestionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
