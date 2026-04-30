import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-writting-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './writting-form.component.html',
  styleUrls: ['./writting-form.component.css'],
})
export class WrittingFormComponent implements OnInit {
  mainForm!: FormGroup;
  rawAnswersInput = '';
  isSaving = false;

  categories: any[] = [];
  activeSections = { raw: true, list: true };

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.mainForm = this.fb.group({
      categoryId: ['', Validators.required],
      question: ['', Validators.required],
      answers: this.fb.array([], Validators.required),
    });

    await this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories = await this.supabase.getCategoriesByType(6);
    } catch (e) {
      this.snackBar.open('Błąd ładowania kategorii', 'Zamknij', { duration: 3000 });
    }
  }

  get answers(): FormArray {
    return this.mainForm.get('answers') as FormArray;
  }

  toggleSection(section: keyof typeof this.activeSections) {
    this.activeSections[section] = !this.activeSections[section];
  }

  addAnswer(value: string = '') {
    this.answers.push(
      this.fb.group({
        value: [value, Validators.required],
      })
    );
  }

  removeAnswer(index: number) {
    this.answers.removeAt(index);
  }

  // SZYBKI IMPORT
  onRawAnswersChange() {
    if (!this.rawAnswersInput.trim()) return;

    // Pobieramy linie, czyścimy obecną listę i wypełniamy nową
    const lines = this.rawAnswersInput
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s);

    this.answers.clear();
    lines.forEach((line) => this.addAnswer(line));
  }

  async save() {
    if (this.mainForm.invalid) {
      this.snackBar.open('Formularz zawiera błędy!', 'Błąd');
      return;
    }

    this.isSaving = true;
    const formVal = this.mainForm.getRawValue();

    try {
      const payload = {
        category_id: formVal.categoryId,
        question: formVal.question,
        answers: formVal.answers,
        hints: [],
        revealed_answers: []
      };

      const { error } = await this.supabase.addQuestion(payload);

      if (error) throw error;

      this.snackBar.open('Pytanie zapisane pomyślnie!', 'Sukces');
      this.resetForm();
    } catch (e: any) {
      console.error('Błąd zapisu:', e);
      this.snackBar.open(`Błąd bazy: ${e.message}`, 'Zamknij');
    } finally {
      this.isSaving = false;
    }
  }

  private resetForm() {
    this.answers.clear();
    this.rawAnswersInput = '';
    this.mainForm.patchValue({ question: '' });
  }
}
