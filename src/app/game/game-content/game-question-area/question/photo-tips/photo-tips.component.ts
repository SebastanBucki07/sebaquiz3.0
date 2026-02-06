import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Hint} from '../../../../../shared/category/category.interface';
import {NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-photo-tips',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './photo-tips.component.html',
  styleUrl: './photo-tips.component.css'
})
export class PhotoTipsComponent {
  @Input() hints: Hint[] = [];
  @Output() hintUsed = new EventEmitter<Hint>();

  useHint(hint: Hint) {
    this.hintUsed.emit(hint);
  }
}
