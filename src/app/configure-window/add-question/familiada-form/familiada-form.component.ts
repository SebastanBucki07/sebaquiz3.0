import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-familiada-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './familiada-form.component.html',
  styleUrls: ['./familiada-form.component.scss'],
})
export class FamiliadaFormComponent implements OnInit {
  generatorForm: FormGroup;
  categories: any[] = [];
  isSaving = false;

  // Stała punktacja Familiady
  readonly POINTS_MAP = [35, 25, 15, 10, 8, 7];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar
  ) {
    this.generatorForm = this.fb.group({
      categoryId: ['', Validators.required],
      questionText: ['', Validators.required],
      answers: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.loadCategories();
    for (let i = 0; i < 6; i++) {
      this.addAnswerField();
    }
  }

  async loadCategories() {
    this.categories = await this.supabaseService.getCategoriesByType(8);
  }

  get answers() {
    return this.generatorForm.get('answers') as FormArray;
  }

  addAnswerField() {
    this.answers.push(this.fb.control(''));
  }

  removeAnswerField(index: number) {
    if (this.answers.length > 1) {
      this.answers.removeAt(index);
    }
  }

  async onSubmit() {
    if (this.generatorForm.invalid) return;

    this.isSaving = true;
    const { categoryId, questionText, answers } = this.generatorForm.value;

    try {
      // 1. SPRAWDZENIE DUPLIKATU
      // Przekazujemy treść pytania i ID kategorii
      const isDuplicate = await this.supabaseService.checkDuplicate(questionText, categoryId);

      if (isDuplicate) {
        this.snackBar.open('To pytanie już istnieje w tej kategorii!', 'DUBEL', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
        });
        this.isSaving = false;
        return; // Przerywamy zapis
      }

      // 2. MAPOWANIE ODPOWIEDZI (jeśli nie ma duplikatu)
      const formattedAnswers = answers
        .map((val: any, index: number) => ({
          value: val ? String(val).trim() : '',
          points: this.POINTS_MAP[index] || 5,
        }))
        .filter((ans: any) => ans.value.length > 0);

      if (formattedAnswers.length === 0) {
        this.snackBar.open('Wpisz treść przynajmniej jednej odpowiedzi!', 'Błąd');
        this.isSaving = false;
        return;
      }

      // 3. PRZYGOTOWANIE I ZAPIS
      const payload = {
        category_id: categoryId,
        question: questionText.trim(),
        answers: formattedAnswers,
        revealed_answers: [], // <--- DODAJ TO KONIECZNIE
        hints: [],
      };

      const { error } = await this.supabaseService.addQuestion(payload);
      if (error) throw error;

      this.snackBar.open('Pytanie Familiadowe zapisane!', 'Sukces');

      // Reset formularza
      this.generatorForm.patchValue({ questionText: '' });
      this.answers.controls.forEach((control) => control.setValue(''));
    } catch (err: any) {
      this.snackBar.open(`Błąd: ${err.message}`, 'Zamknij');
    } finally {
      this.isSaving = false;
    }
  }

  onQuickPaste(event: any): void {
    const input = event.target.value;
    if (!input) return;

    const rawValues = input.split('\n').filter((v: string) => v.trim().length > 0);

    const answersArray = this.generatorForm.get('answers') as FormArray;

    if (answersArray) {
      answersArray.controls.forEach((control) => control.setValue(''));

      rawValues.forEach((val: string, index: number) => {
        if (index < answersArray.length) {
          answersArray.at(index).setValue(val.trim());
        }
      });
    }
  }
}
