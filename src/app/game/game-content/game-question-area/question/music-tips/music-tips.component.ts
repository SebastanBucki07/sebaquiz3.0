import {Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MATERIAL_IMPORTS} from '../../../../../shared/material';

@Component({
  selector: 'app-music-tips',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS],
  templateUrl: './music-tips.component.html',
})
export class MusicTipsComponent {
  @Output() playIntro = new EventEmitter<void>();
  @Output() playMiddle = new EventEmitter<void>();
  @Output() playOutro = new EventEmitter<void>();

  // zmienne, które będą kontrolować, czy przycisk jest aktywny
  introPlayed = false;
  middlePlayed = false;
  outroPlayed = false;

  playIntroOnce() {
    this.playIntro.emit();
    this.introPlayed = true; // blokujemy przycisk
  }

  playMiddleOnce() {
    this.playMiddle.emit();
    this.middlePlayed = true;
  }

  playOutroOnce() {
    this.playOutro.emit();
    this.outroPlayed = true;
  }
}
