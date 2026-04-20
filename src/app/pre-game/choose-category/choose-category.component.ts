import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MATERIAL_IMPORTS } from '../../shared/material';
import { GameService } from '../../services/game.service';
import { SupabaseService } from '../../services/supabase.service';
import { Category } from '../../shared/models/category/category.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

interface CategoryGroup {
  typeName: string;
  categories: Category[];
}

@Component({
  selector: 'app-choose-category',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS, MatProgressSpinner],
  templateUrl: './choose-category.component.html',
  styleUrl: './choose-category.component.css',
})
export class ChooseCategoryComponent implements OnInit, OnDestroy {
  allCategories: Category[] = [];
  categoryGroups: CategoryGroup[] = []; // Nowa struktura dla widoku gazetowego
  selectedCategories: Category[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private gameService: GameService,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.loadSelectedFromStorage();
    await this.initData();

    this.gameService.reset$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.removeAllCategories());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async initData() {
    this.isLoading = true;
    try {
      const data = await this.supabaseService.getCategories();

      this.allCategories = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        type: cat.category_types?.name || 'inne',
        basePoints: cat.base_points,
        icon: cat.icon,
        color: cat.color,
        hints: [],
      }));

      this.prepareDynamicLayout();
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private prepareDynamicLayout() {
    const groupsMap: { [key: string]: Category[] } = {};

    // 1. Wstępne grupowanie
    this.allCategories.forEach((cat) => {
      const type = (cat.type || 'inne').toLowerCase();
      if (!groupsMap[type]) groupsMap[type] = [];
      groupsMap[type].push(cat);
    });

    // 2. Optymalizacja: Przenoszenie "pustelników" do grupy 'inne'
    const finalGroups: { [key: string]: Category[] } = {};
    const othersKey = 'inne';

    if (!finalGroups[othersKey]) finalGroups[othersKey] = [];

    Object.keys(groupsMap).forEach((key) => {
      // Jeśli grupa ma tylko 1 kategorię i to nie jest już grupa 'inne'
      if (groupsMap[key].length === 1 && key !== othersKey) {
        finalGroups[othersKey].push(...groupsMap[key]);
      } else {
        // Jeśli grupa ma więcej niż 1 lub jest to grupa 'inne'
        if (!finalGroups[key]) finalGroups[key] = [];
        finalGroups[key].push(...groupsMap[key]);
      }
    });

    // 3. Mapowanie na strukturę CategoryGroup i czyszczenie pustych grup
    this.categoryGroups = Object.keys(finalGroups)
      .filter((key) => finalGroups[key].length > 0) // Usuwamy ewentualne puste klucze
      .map((key) => ({
        typeName: key,
        categories: finalGroups[key],
      }))
      // Sortowanie: grupy z największą ilością kategorii na górę
      .sort((a, b) => b.categories.length - a.categories.length);
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }

  isCategorySelected(category: Category): boolean {
    return this.selectedCategories.some((c) => c.id === category.id);
  }

  getCategoryStyle(cat: Category, isSidebar: boolean = false) {
    const color = cat.color || '#3b82f6';
    if (isSidebar) {
      return {
        'border-left': `4px solid ${color}`,
        background: `rgba(255, 255, 255, 0.05)`,
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

  removeCategory(cat: Category) {
    this.selectedCategories = this.selectedCategories.filter((c) => c.id !== cat.id);
    this.save();
  }

  addAllCategories() {
    this.selectedCategories = [...this.allCategories];
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
      } catch {
        this.selectedCategories = [];
      }
    }
  }
}
