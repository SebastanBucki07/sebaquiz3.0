import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GameTimerComponent } from './game-timer.component';

describe('GameTimerComponent', () => {
  let component: GameTimerComponent;
  let fixture: ComponentFixture<GameTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTimerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GameTimerComponent);
    component = fixture.componentInstance;
  });

  it('should start with the provided time limit', () => {
    component.startSeconds = 45;
    fixture.detectChanges();
    expect(component.timeLeft).toBe(45);
  });

  it('should decrease timeLeft every second', fakeAsync(() => {
    component.startSeconds = 10;
    fixture.detectChanges(); // ngOnInit starts timer

    tick(1000); // Przesuń czas o 1s
    expect(component.timeLeft).toBe(9);

    tick(5000); // Przesuń o kolejne 5s
    expect(component.timeLeft).toBe(4);

    component.stopTimer(); // Clean up
  }));

  it('should emit expired event when timeLeft reaches zero', fakeAsync(() => {
    spyOn(component.expired, 'emit');
    component.startSeconds = 3;
    fixture.detectChanges();

    tick(3000);

    expect(component.timeLeft).toBe(0);
    expect(component.expired.emit).toHaveBeenCalled();
  }));

  it('should not decrease time when paused is true', fakeAsync(() => {
    component.startSeconds = 10;
    component.paused = true;
    fixture.detectChanges();

    tick(2000);

    expect(component.timeLeft).toBe(10); // Czas stoi w miejscu
  }));
});
