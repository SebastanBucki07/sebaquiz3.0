import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Hint} from '../../../../shared/category/category.interface';
import {ActivatedRoute} from '@angular/router';
import {CATEGORY_LIST} from '../../../../shared/category/categoryList';
import {TipsComponent} from '../question/tips/tips.component';

@Component({
  selector: 'app-hints-category',
  imports: [
    TipsComponent
  ],
  templateUrl: './hints-category.component.html',
  styleUrl: './hints-category.component.css'
})
export class HintsCategoryComponent implements OnInit {
  @Output() hintUsed = new EventEmitter<Hint>();
  hints: Hint[] = [];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const parentRoute = this.route.parent;
    if (!parentRoute) return;


    const name = parentRoute.snapshot.paramMap.get('name');
    const type = parentRoute.snapshot.paramMap.get('type');


    const category = CATEGORY_LIST.find(
      c => c.name === name && c.type === type
    );

    this.hints = category?.hints ?? [];
  }

  onHintUsed(hint: Hint): void {
    console.log('FORWARDING HINT', hint);
    this.hintUsed.emit(hint);
  }
}
