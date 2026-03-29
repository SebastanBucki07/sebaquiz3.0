import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MATERIAL_IMPORTS} from '../../shared/material';
import {GameService} from '../../services/game.service';
import {CATEGORY_LIST} from '../../shared/models/category/categoryList';
import {Category} from '../../shared/models/category/category.interface';

@Component({
  selector: 'app-choose-category',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS],
  templateUrl: './choose-category.component.html',
  styleUrl: './choose-category.component.css',
})
export class ChooseCategoryComponent implements OnInit, OnDestroy {
  groupedCategories: { [key: string]: Category[] } = {};
  selectedCategories: Category[] = [];
  private destroy$ = new Subject<void>();

  public readonly typeHues: { [key: string]: number } = {
    'music': 285, 'one-answer': 140, 'abcd': 195, 'photos': 35,
    'hints': 48, 'writting-category': 215, 'photo-fragments': 10,
    'photo-hints': 170, 'familiada': 325, 'footballgame': 125,
    'tictactoe': 0, 'country': 110, 'inne': 250
  };

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.groupCategories();
    this.loadSelectedFromStorage();
    this.gameService.reset$.pipe(takeUntil(this.destroy$)).subscribe(() => this.removeAllCategories());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private groupCategories() {
    const groups: { [key: string]: Category[] } = {};
    CATEGORY_LIST.forEach(cat => {
      const type = (cat.type || 'inne').toLowerCase();
      if (!groups[type]) groups[type] = [];
      groups[type].push(cat);
    });
    this.groupedCategories = groups;
  }

  getAvailableInGroup(items: Category[]): Category[] {
    return items.filter(cat => !this.selectedCategories.some(s => s.id === cat.id));
  }

  hasAvailableCategories(): boolean {
    return CATEGORY_LIST.length > this.selectedCategories.length;
  }

  getCategoryStyle(cat: Category, index: number, total: number, isSidebar: boolean = false) {
    const hue = this.typeHues[cat.type.toLowerCase()] ?? 250;
    const color = `hsl(${hue}, 70%, ${isSidebar ? 40 : 50}%)`;

    if (isSidebar) {
      return {'border-left': `5px solid ${color}`, 'background': `hsl(${hue}, 70%, 98%)`, 'color': color};
    }

    return {
      'background-color': `hsl(${hue}, 75%, 50%)`,
      'color': 'white',
      'box-shadow': `0 5px 0 0 hsl(${hue}, 75%, 35%)`
    };
  }

  addCategory(cat: Category) {
    if (!this.selectedCategories.some(c => c.id === cat.id)) {
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

  private loadSelectedFromStorage() {
    const s = localStorage.getItem('selectedCategories');
    if (s) this.selectedCategories = JSON.parse(s);
  }

  private save() {
    localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    this.gameService.notifyDataChanged();
  }
}
