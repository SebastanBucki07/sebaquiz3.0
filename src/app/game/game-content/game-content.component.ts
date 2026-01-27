import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {Category} from '../../shared/category/category.interface';

@Component({
  selector: 'app-game-content',
  templateUrl: './game-content.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterOutlet
  ],
  styleUrl: './game-content.component.css'
})
export class GameContentComponent implements OnInit{
  selectedCategories: Category[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const saved = localStorage.getItem('selectedCategories');
    this.selectedCategories = saved ? JSON.parse(saved) : [];
  }

  goToCategory(category: Category) {
    this.router.navigate([
      '/game/category',
      category.name
    ]);
  }

  colors = [
    '#3f51b5', '#e91e63', '#009688',
    '#ff9800', '#673ab7', '#4caf50'
  ];

  getCategoryColor(index: number): string {
    const hue = (index * 360) / this.selectedCategories.length;
    return `hsl(${hue}, 70%, 50%)`;
  }



}
