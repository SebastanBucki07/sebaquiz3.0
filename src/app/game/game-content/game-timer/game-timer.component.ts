import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-game-timer',
  imports: [MatIcon],
  templateUrl: './game-timer.component.html',
  styleUrl: './game-timer.component.css',
})
export class GameTimerComponent implements OnInit, OnDestroy {
  @Input() startSeconds: number = 30;
  @Input() paused: boolean = false;
  @Output() expired = new EventEmitter<void>();

  timeLeft: number = 0;
  private timerSub?: Subscription;

  ngOnInit() {
    this.timeLeft = this.startSeconds;
    this.startTimer();
  }

  startTimer() {
    this.timerSub = interval(1000).subscribe(() => {
      if (this.paused || this.timeLeft <= 0) return;

      this.timeLeft--;

      if (this.timeLeft === 0) {
        this.expired.emit();
        this.stopTimer();
      }
    });
  }

  stopTimer() {
    this.timerSub?.unsubscribe();
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
