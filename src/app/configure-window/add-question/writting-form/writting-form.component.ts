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
import { ActivatedRoute, Router } from '@angular/router';
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

  // Tryb Edycji
  isEditMode = false;
  editingId: number | null = null;
  allQuestions: any[] = [];

  categories: any[] = [];
  activeSections = { raw: true, list: true };
  searchQuery: string = '';

  /**
   * Getter filtrujący listę lokalnie.
   * Szuka frazy w pytaniu ORAZ w pierwszej odpowiedzi (displayAnswer).
   */
  get filteredQuestions() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.allQuestions;

    return this.allQuestions.filter((q) => {
      const questionMatch = (q.question || '').toLowerCase().includes(query);
      const answerMatch = (q.displayAnswer || '').toLowerCase().includes(query);
      return questionMatch || answerMatch;
    });
  }

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.initForm();
    await this.loadCategories();

    // Reaguj na zmianę kategorii: czyść wyszukiwarkę i ładuj nową paczkę danych
    this.mainForm.get('categoryId')?.valueChanges.subscribe((catId) => {
      this.searchQuery = '';
      if (catId) {
        this.loadQuestions(catId);
      } else {
        this.allQuestions = [];
      }
    });
  }

  /**
   * Pobiera pytania z bazy dla danej kategorii.
   * Mapuje odpowiedzi do formatu tekstowego dla podglądu na liście.
   */
  async loadQuestions(catId?: number) {
    try {
      const { data, error } = await this.supabase.getQuestionsList(1000, catId);
      if (!error && data) {
        this.allQuestions = data.map((q) => {
          const parsedAns = typeof q.answers === 'string' ? JSON.parse(q.answers) : q.answers || [];
          // Wyciągamy pierwszą odpowiedź jako podgląd na liście (do filtrowania i wyświetlania)
          const display = Array.isArray(parsedAns)
            ? parsedAns[0]?.value || ''
            : parsedAns?.value || '';

          return {
            ...q,
            displayAnswer: display,
          };
        });
      }
    } catch (e) {
      console.error('Błąd podczas ładowania pytań:', e);
    }
  }

  private initForm() {
    this.mainForm = this.fb.group({
      categoryId: ['', Validators.required],
      question: ['', Validators.required],
      answers: this.fb.array([], Validators.required),
    });
  }

  async loadCategories() {
    try {
      this.categories = await this.supabase.getCategoriesByType(6);
    } catch (e) {
      this.snackBar.open('Błąd ładowania kategorii', 'Zamknij', { duration: 3000 });
    }
  }

  async loadQuestionToEdit(id: number) {
    try {
      const { data, error } = await this.supabase.getQuestionById(id);

      if (error || !data) {
        this.snackBar.open('Nie znaleziono pytania', 'Błąd', { duration: 3000 });
        return;
      }

      this.isEditMode = true;
      this.editingId = Number(data.id);

      this.answers.clear();
      this.mainForm.patchValue({
        categoryId: data.category_id,
        question: data.question,
      });

      const answersData =
        typeof data.answers === 'string' ? JSON.parse(data.answers) : data.answers;
      if (Array.isArray(answersData)) {
        answersData.forEach((a: any) => this.addAnswer(a.value));
      }

      // Przewiń formularz na górę po kliknięciu edycji
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  }

  get answers(): FormArray {
    return this.mainForm.get('answers') as FormArray;
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

  /**
   * Obsługa masowego wklejania odpowiedzi
   */
  onRawAnswersChange() {
    if (!this.rawAnswersInput.trim()) return;

    const lines = this.rawAnswersInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s);

    this.answers.clear();
    lines.forEach((line) => this.addAnswer(line));
  }

  async save() {
    if (this.mainForm.invalid) {
      this.snackBar.open('Wypełnij wszystkie pola!', 'OK');
      return;
    }

    this.isSaving = true;
    const formVal = this.mainForm.getRawValue();

    try {
      const payload = {
        category_id: formVal.categoryId,
        question: formVal.question,
        answers: formVal.answers, // Array [{value: '...'}]
        hints: [],
        revealed_answers: [],
      };

      if (this.isEditMode && this.editingId) {
        await this.supabase.updateQuestion(this.editingId, payload);
      } else {
        await this.supabase.addQuestion(payload);
      }

      this.snackBar.open('Zapisano pomyślnie!', 'Sukces', { duration: 2000 });
      this.resetForm();
      await this.loadQuestions(formVal.categoryId);
    } catch (e) {
      console.error('Błąd podczas zapisu:', e);
      this.snackBar.open('Wystąpił błąd podczas zapisu', 'OK');
    } finally {
      this.isSaving = false;
    }
  }

  resetForm() {
    const currentCat = this.mainForm.get('categoryId')?.value;
    this.isEditMode = false;
    this.editingId = null;
    this.answers.clear();
    this.rawAnswersInput = '';
    this.mainForm.reset();

    // Przywracamy kategorię, aby użytkownik nie musiał jej klikać ponownie
    this.mainForm.get('categoryId')?.setValue(currentCat);

    this.router.navigate([], { queryParams: { id: null }, queryParamsHandling: 'merge' });
  }
}
