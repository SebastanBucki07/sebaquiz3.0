import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Hint} from '../../../../../shared/category/category.interface';
import {NgFor, NgIf} from '@angular/common';
import {MATERIAL_IMPORTS} from '../../../../../shared/material';
import {MatCardFooter} from '@angular/material/card';

@Component({
  selector: 'app-photo-tips',
  standalone: true,
  imports: [NgIf, NgFor,MATERIAL_IMPORTS, MatCardFooter],
  templateUrl: './photo-tips.component.html',
  styleUrl: './photo-tips.component.css'
})
export class PhotoTipsComponent {
  @Input() hints: Hint[] = [];
  @Output() hintUsed = new EventEmitter<Hint>();

  useHint(hint: Hint) {
    this.hintUsed.emit(hint);
  }

  gridCols = 4;

  ngOnInit() {
    this.updateGridCols();
    window.addEventListener('resize', () => this.updateGridCols());
  }

  private updateGridCols() {
    const width = window.innerWidth;
    if (width > 1200) this.gridCols = 4;
    else if (width > 900) this.gridCols = 3;
    else if (width > 600) this.gridCols = 2;
    else this.gridCols = 1;
  }
}
