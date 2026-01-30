import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoFragmentsCategoryComponent } from './photo-fragments-category.component';

describe('PhotoFragmentsCategoryComponent', () => {
  let component: PhotoFragmentsCategoryComponent;
  let fixture: ComponentFixture<PhotoFragmentsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoFragmentsCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoFragmentsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
