import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Hint } from '../../../../../shared/models/category/hint.interface';
import { MatCard } from '@angular/material/card';
import { SupabaseService } from '../../../../../services/supabase.service';

@Component({
  selector: 'app-photo-tips',
  standalone: true,
  imports: [NgIf, NgFor, MatCard],
  templateUrl: './photo-tips.component.html',
  styleUrl: './photo-tips.component.css',
})
export class PhotoTipsComponent implements OnInit {
  @Input() hints: Hint[] = [];
  @Output() hintUsed = new EventEmitter<Hint>();

  private clubsCache: any[] = [];

  constructor(public supabase: SupabaseService) {}

  async ngOnInit() {
    this.updateGridCols();
    window.addEventListener('resize', () => this.updateGridCols());

    try {
      const { data } = await this.supabase.getClubs();
      this.clubsCache = data || [];
    } catch (err) {
      console.error('Błąd ładowania klubów w PhotoTips:', err);
    }
  }

  getHintImage(hint: Hint): string {
    if (hint.content && hint.content.startsWith('http')) {
      return hint.content;
    }

    const label = hint.label;
    if (!label) return `${this.supabase.STORAGE_URL}footballCrestes/no-image.png`;

    const club = this.clubsCache.find(
      (c) =>
        c.name.toLowerCase() === label.toLowerCase() ||
        c.file_name.toLowerCase().includes(label.toLowerCase())
    );

    if (club) {
      const path = club.file_name.startsWith('footballCrestes/')
        ? club.file_name
        : `footballCrestes/${club.file_name}`;
      return `${this.supabase.STORAGE_URL}${path}`;
    }

    return hint.content || `${this.supabase.STORAGE_URL}footballCrestes/no-image.png`;
  }

  useHint(hint: Hint) {
    this.hintUsed.emit(hint);
  }

  gridCols = 4;

  private updateGridCols() {
    const width = window.innerWidth;
    if (width > 1200) this.gridCols = 4;
    else if (width > 900) this.gridCols = 3;
    else if (width > 600) this.gridCols = 2;
    else this.gridCols = 1;
  }
}
