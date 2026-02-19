import { Component, OnInit, OnDestroy } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material';
import { GameService } from '../../shared/game.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CATEGORY_LIST } from '../../shared/category/categoryList';
import { Category } from '../../shared/category/category.interface';

@Component({
  selector: 'app-choose-category',
  standalone: true,
  imports: MATERIAL_IMPORTS,
  templateUrl: './choose-category.component.html',
  styleUrl: './choose-category.component.css',
})
export class ChooseCategoryComponent implements OnInit, OnDestroy {
  availableCategories: Category[] = [];
  selectedCategories: Category[] = [];
  private destroy$ = new Subject<void>();

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadCategories();

    // Listen for game reset
    this.gameService.reset$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selectedCategories = [];
      this.loadCategories();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.availableCategories = [...CATEGORY_LIST];

    // Load selected from localStorage
    const saved = localStorage.getItem('selectedCategories');
    if (saved) {
      this.selectedCategories = JSON.parse(saved);
      // Remove selected from available
      this.availableCategories = this.availableCategories.filter(
        (cat) => !this.selectedCategories.some((sel) => sel.id === cat.id)
      );
    }
  }

  addCategory(category: Category) {
    this.selectedCategories = [...this.selectedCategories, category];
    this.availableCategories = this.availableCategories.filter((c) => c.id !== category.id);
    this.saveCategories();
  }

  removeCategory(category: Category) {
    this.selectedCategories = this.selectedCategories.filter((c) => c.id !== category.id);
    this.availableCategories = [...this.availableCategories, category].sort((a, b) => a.id - b.id);
    this.saveCategories();
  }

  saveCategories() {
    localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    this.gameService.notifyDataChanged();
  }

  addAllCategories(): void {
    this.availableCategories.forEach((category) => {
      this.addCategory(category);
    });
  }

  removeAllCategories(): void {
    this.selectedCategories.forEach((category) => {
      this.removeCategory(category);
    });
  }
}
