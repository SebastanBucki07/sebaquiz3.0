import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MATERIAL_IMPORTS} from '../../../../shared/material';

@Component({
  selector: 'app-question-area-header',
  imports: MATERIAL_IMPORTS,
  templateUrl: './question-area-header.component.html',
  styleUrl: './question-area-header.component.css'
})
export class QuestionAreaHeaderComponent {
  categoryName!: string;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.categoryName = this.route.snapshot.paramMap.get('name')!;
  }
}
