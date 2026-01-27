import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../../../../shared/material';
import { Hint } from '../../../../../shared/category/category.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS, MatExpansionModule, MatButtonModule],
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TipsComponent {
  @Input() hints: Hint[] = [];
  @Output() hintUsed = new EventEmitter<Hint>();

  // array of discovered hints

  revealedHints: Hint[] = [];

  // method called when clicking the panel
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
