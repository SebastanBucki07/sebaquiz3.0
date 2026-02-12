import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MATERIAL_IMPORTS} from '../../../../../shared/material';
import {Hint} from '../../../../../shared/category/category.interface';

@Component({
  selector: 'app-music-tips',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS],
  templateUrl: './music-tips.component.html',
  styleUrl:'music-tips.component.scss'
})
export class MusicTipsComponent {
  @Output() playIntro = new EventEmitter<void>();
  @Output() playMiddle = new EventEmitter<void>();
  @Output() playOutro = new EventEmitter<void>();
  @Output() hintUsed = new EventEmitter<Hint>();
  @Input() hints: Hint[] = [];

  // zmienne, które będą kontrolować, czy przycisk jest aktywny
  introPlayed = false;
  middlePlayed = false;
  outroPlayed = false;

  playIntroOnce() {
    this.playIntro.emit();
    this.hintUsed.emit({
      id: 1,
      label: "intro",
      penaltyPercent: 0,
      content: "intro",
    } as unknown as Hint);
    this.introPlayed = true; // blokujemy przycisk
  }

  playMiddleOnce() {
    this.playMiddle.emit();
    this.hintUsed.emit({
      id: 2,
      label: "middle",
      penaltyPercent: 30,
      content: "middle",
    } as unknown as Hint);
    this.middlePlayed = true;
  }

  playOutroOnce() {
    this.playOutro.emit();
    this.hintUsed.emit({
      id: 3,
      label: "outro",
      penaltyPercent: 30,
      content: "outro",
    } as unknown as Hint);
    this.outroPlayed = true;
  }

  useHint(hint: Hint): void {
    this.hintUsed.emit(hint);
  }
}
