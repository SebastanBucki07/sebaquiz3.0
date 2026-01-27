import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosCategoryComponent } from './photos-category.component';

describe('PhotosCategoryComponent', () => {
  let component: PhotosCategoryComponent;
  let fixture: ComponentFixture<PhotosCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
