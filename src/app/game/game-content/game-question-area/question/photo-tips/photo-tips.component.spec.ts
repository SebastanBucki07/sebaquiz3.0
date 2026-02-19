import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoTipsComponent } from './photo-tips.component';

describe('PhotoTipsComponent', () => {
  let component: PhotoTipsComponent;
  let fixture: ComponentFixture<PhotoTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoTipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
