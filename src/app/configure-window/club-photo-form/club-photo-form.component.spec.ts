import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubPhotoFormComponent } from './club-photo-form.component';

describe('ClubPhotoFormComponent', () => {
  let component: ClubPhotoFormComponent;
  let fixture: ComponentFixture<ClubPhotoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubPhotoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubPhotoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
