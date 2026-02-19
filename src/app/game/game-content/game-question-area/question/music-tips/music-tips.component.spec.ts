import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicTipsComponent } from './music-tips.component';

describe('MusicTipsComponent', () => {
  let component: MusicTipsComponent;
  let fixture: ComponentFixture<MusicTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicTipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MusicTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
