import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingPhotoFormComponent } from './building-photo-form.component';

describe('BuildingPhotoFormComponent', () => {
  let component: BuildingPhotoFormComponent;
  let fixture: ComponentFixture<BuildingPhotoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingPhotoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingPhotoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
