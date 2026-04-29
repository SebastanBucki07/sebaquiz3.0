import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FootballFormComponent} from './football-form.component';


describe('FootballFormComponent', () => {
  let component: FootballFormComponent;
  let fixture: ComponentFixture<FootballFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootballFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootballFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
