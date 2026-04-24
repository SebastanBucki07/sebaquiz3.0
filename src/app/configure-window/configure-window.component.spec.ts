import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureWindowComponent } from './configure-window.component';

describe('ConfigureWindowComponent', () => {
  let component: ConfigureWindowComponent;
  let fixture: ComponentFixture<ConfigureWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
