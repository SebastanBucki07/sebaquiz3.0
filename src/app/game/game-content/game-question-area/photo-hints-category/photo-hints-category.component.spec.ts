import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoHintsCategoryComponent } from './photo-hints-category.component';

describe('PhotoHintsCategoryComponent', () => {
  let component: PhotoHintsCategoryComponent;
  let fixture: ComponentFixture<PhotoHintsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoHintsCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoHintsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
