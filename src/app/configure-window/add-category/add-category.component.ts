import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SupabaseService} from '../../services/supabase.service';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIcon} from '@angular/material/icon';
import {MatOption} from '@angular/material/core';
import {MatFormField, MatLabel, MatSelect, MatSelectModule, MatSelectTrigger} from '@angular/material/select';
import {CommonModule, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-add-category',
  imports: [
    CommonModule,
    MatCheckbox,
    MatOption,
    MatIcon,
    MatSelectTrigger,
    MatSelect,
    MatSelectModule,
    MatLabel,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatButton,
    MatProgressSpinner
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categoryTypes: any[] = [];
  isLoading = false;

  availableIcons = [
    'star', 'quiz', 'school', 'history', 'science', 'language',
    'sports_soccer', 'movie', 'music_note', 'menu_book', 'psychology', 'public',
    'emoji_events', 'rocket_launch', 'location_on', 'theater_comedy'
  ];

  getSelectedTypeName(): string {
    const id = this.categoryForm.get('type_id')?.value;
    const type = this.categoryTypes.find(t => t.id === id);
    return type ? (type.name || type.label) : '';
  }

  constructor(private fb: FormBuilder, private supabase: SupabaseService) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type_id: [null, Validators.required],
      color: ['#3b82f6', Validators.required],
      base_points: [10, [Validators.required, Validators.min(1), Validators.max(99)]],
      is_active: [true],
      icon: ['quiz', Validators.required]
    });
  }

  get f() { return this.categoryForm.controls; }
  get nameControl() { return this.categoryForm.get('name'); }
  get typeControl() { return this.categoryForm.get('type_id'); }
  get pointsControl() { return this.categoryForm.get('base_points'); }
  get iconControl() { return this.categoryForm.get('icon'); }

  async ngOnInit() {
    try {
      this.categoryTypes = await this.supabase.getCategoryTypes();
    } catch (error) {
      console.error('Błąd:', error);
    }
  }

  async onSubmit() {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      try {
        await this.supabase.addCategory(this.categoryForm.value);
        alert('Kategoria dodana pomyślnie!');
        this.categoryForm.reset({
          color: '#3b82f6',
          base_points: 10,
          is_active: true,
          icon: 'quiz'
        });
      } catch (error) {
        console.error(error);
        alert('Błąd podczas zapisu do bazy danych.');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
