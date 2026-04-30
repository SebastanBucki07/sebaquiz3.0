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

  // Dodaj tę metodę (tzw. getter), która filtruje listę na żywo
  get filteredQuestions() {
    const selectedCatId = this.mainForm.get('categoryId')?.value;
    const query = this.searchQuery.toLowerCase().trim();

    return this.allQuestions.filter((q) => {
      // Warunek 1: Kategoria (jeśli wybrana, to musi się zgadzać)
      const matchesCategory = selectedCatId ? q.category_id === selectedCatId : true;

      // Warunek 2: Wyszukiwarka tekstowa
      const matchesQuery = q.question.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
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
    await this.loadQuestions(); // Wczytaj startowe dane

    // NOWOŚĆ: Gdy użytkownik zmieni kategorię w select, pobierz nowe dane z bazy
    this.mainForm.get('categoryId')?.valueChanges.subscribe((catId) => {
      this.loadQuestions(catId);
    });

    this.route.queryParams.subscribe(async (params) => {
      if (params['id']) {
        await this.loadQuestionToEdit(Number(params['id']));
      }
    });
  }

  // Zmodyfikowana metoda pobierania
  async loadQuestions(catId?: number) {
    try {
      // Przekazujemy catId do serwisu
      const { data, error } = await this.supabase.getQuestionsList(20, catId);
      if (!error) {
        this.allQuestions = data || [];
      }
    } catch (e) {
      console.error('Błąd ładowania listy pytań:', e);
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
      console.log('Ładowanie pytania o ID:', id); // DEBUG
      const { data, error } = await this.supabase.getQuestionById(id);

      if (error || !data) {
        this.snackBar.open('Nie znaleziono pytania', 'Błąd', { duration: 3000 });
        return;
      }

      // KLUCZOWE LINIE:
      this.isEditMode = true;
      this.editingId = Number(data.id); // Wymuszamy format liczbowy

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
    } catch (e) {
      console.error(e);
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
    console.log('1. Metoda save() wystartowała');

    if (this.mainForm.invalid) {
      console.log('2. Formularz jest niepoprawny:', this.mainForm.errors);
      this.snackBar.open('Wypełnij wszystkie pola!', 'OK');
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
        revealed_answers: [],
      };

      if (this.isEditMode && this.editingId) {
        console.log('3. Próba wysłania UPDATE dla ID:', this.editingId);
        const result = await this.supabase.updateQuestion(this.editingId, payload);
        console.log('4. Odpowiedź z serwisu (update):', result);
      } else {
        console.log('3. Próba wysłania INSERT (nowe pytanie)');
        const result = await this.supabase.addQuestion(payload);
        console.log('4. Odpowiedź z serwisu (add):', result);
      }

      this.snackBar.open('Zapisano pomyślnie!', 'Sukces');
      this.resetForm();
      await this.loadQuestions();
    } catch (e) {
      console.error('BŁĄD KRYTYCZNY:', e);
    } finally {
      this.isSaving = false;
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.editingId = null;
    this.answers.clear();
    this.rawAnswersInput = '';
    this.mainForm.patchValue({
      question: '',
      categoryId: this.mainForm.value.categoryId, // Opcjonalnie: zostawiamy kategorię dla wygody
    });

    // Usuwamy ID z paska adresu, aby nie wisiało po resecie
    this.router.navigate([], { queryParams: { id: null }, queryParamsHandling: 'merge' });
  }
}
