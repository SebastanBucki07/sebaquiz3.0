import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MATERIAL_IMPORTS } from '../../shared/material';
import { GameService } from '../../services/game.service';
import { CATEGORY_LIST } from '../../shared/models/category/categoryList';
import { Category } from '../../shared/models/category/category.interface';

interface CategoryGroup {
  typeName: string;
  categories: Category[];
}

@Component({
  selector: 'app-choose-category',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS],
  templateUrl: './choose-category.component.html',
  styleUrl: './choose-category.component.css',
})
export class ChooseCategoryComponent implements OnInit, OnDestroy {
  columns: CategoryGroup[][] = [];
  selectedCategories: Category[] = [];
  private destroy$ = new Subject<void>();

  public readonly typeHues: { [key: string]: number } = {
    'music': 285, 'one-answer': 140, 'abcd': 195, 'photos': 35,
    'hints': 48, 'writting-category': 215, 'photo-fragments': 15,
    'photo-hints': 175, 'familiada': 325, 'footballgame': 125,
    'tictactoe': 5, 'country': 100, 'inne': 250
  };

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadSelectedFromStorage();
    this.prepareMultiColumnLayout();
    this.gameService.reset$
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.removeAllCategories());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private prepareMultiColumnLayout() {
    const groupsMap: { [key: string]: Category[] } = {};
    CATEGORY_LIST.forEach(cat => {
      const type = (cat.type || 'inne').toLowerCase();
      if (!groupsMap[type]) groupsMap[type] = [];
      groupsMap[type].push(cat);
    });

    const allGroups: CategoryGroup[] = Object.keys(groupsMap).map(key => ({
      typeName: key,
      categories: groupsMap[key]
    }));

    const numberOfColumns = 4;
    this.columns = Array.from({ length: numberOfColumns }, () => []);
    allGroups.forEach((group, index) => {
      this.columns[index % numberOfColumns].push(group);
    });
  }

  isCategorySelected(category: Category): boolean {
    return this.selectedCategories.some(c => c.id === category.id);
  }

  getCategoryStyle(cat: Category, isSidebar: boolean = false) {
    const hue = this.typeHues[cat.type.toLowerCase()] ?? 250;
    const color = `hsl(${hue}, 70%, 50%)`;

    if (isSidebar) {
      return {
        'border-left': `4px solid ${color}`,
        'background': `rgba(255, 255, 255, 0.05)`,
        'color': '#f8fafc'
      };
    }
    return { 'border-top': `3px solid ${color}` };
  }

  getTotalPoints(): number {
    return this.selectedCategories.reduce((sum, cat) => sum + cat.basePoints, 0);
  }

  addCategory(cat: Category) {
    if (!this.isCategorySelected(cat)) {
      this.selectedCategories = [...this.selectedCategories, cat];
      this.save();
    }
  }

  addAllCategories() {
    this.selectedCategories = [...CATEGORY_LIST];
    this.save();
  }

  removeCategory(cat: Category) {
    this.selectedCategories = this.selectedCategories.filter(c => c.id !== cat.id);
    this.save();
  }

  removeAllCategories() {
    this.selectedCategories = [];
    this.save();
  }

  private save() {
    localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    this.gameService.notifyDataChanged();
  }

  private loadSelectedFromStorage() {
    const saved = localStorage.getItem('selectedCategories');
    if (saved) {
      try {
        this.selectedCategories = JSON.parse(saved);
      } catch (e) {
        this.selectedCategories = [];
      }
    }
  }
}
