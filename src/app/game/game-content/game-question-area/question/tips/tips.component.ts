import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { Hint } from '../../../../../shared/models/category/hint.interface';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule, MatIcon],
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TipsComponent implements OnChanges {
  @Input() hints: Hint[] = [];
  @Output() hintUsed = new EventEmitter<Hint>();

  revealedHints: Hint[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hints']) {
      this.revealedHints = [];
    }
  }

  showHint(hint: Hint) {
    if (!this.isRevealed(hint)) {
      this.revealedHints.push(hint);
      this.hintUsed.emit(hint);
    }
  }

  isRevealed(hint: Hint): boolean {
    return this.revealedHints.includes(hint);
  }
}
