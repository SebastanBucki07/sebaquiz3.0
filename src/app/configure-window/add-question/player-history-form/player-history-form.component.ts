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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupabaseService } from '../../../services/supabase.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// RxJS
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { normalizeText, validateAnswerHelper } from '../../../shared/utils/text-logic';

@Component({
  selector: 'app-player-history-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatAutocompleteModule,
  ],
  templateUrl: './player-history-form.component.html',
  styleUrls: ['./player-history-form.component.css'],
})
export class PlayerHistoryFormComponent implements OnInit {
  mainForm!: FormGroup;
  isSaving = false;
  isEditMode = false;
  editingId: number | null = null;

  availableCountries: any[] = [];
  allClubs: any[] = [];
  categories: any[] = [];
  allQuestions: any[] = [];
  isDuplicate = false;

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  filteredCountries!: Observable<any[]>;
  filteredClubsSelectors: Observable<any[]>[] = [];

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.initForm();
    await this.loadInitialData();
    this.setupAutocompletes();

    // 1. OBSŁUGA ZMIANY KATEGORII (Nowe!)
    // Blokuje/odblokowuje wyszukiwarkę i pobiera listę pytań
    this.mainForm.get('categoryId')?.valueChanges.subscribe((catId) => {
      this.searchQuery = ''; // Czyścimy wyszukiwarkę przy zmianie kategorii
      if (catId) {
        this.refreshQuestions(); // Pobierz listę dla nowej kategorii
      } else {
        this.allQuestions = []; // Wyczyść listę, jeśli brak kategorii
      }
    });

    // 2. SPRAWDZANIE DUPLIKATÓW
    this.mainForm
      .get('answer')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (name) => {
        // W trybie edycji nie sprawdzamy duplikatu (żeby nie krzyczał na samego siebie)
        if (this.isEditMode) {
          this.isDuplicate = false;
          return;
        }

        const catId = this.mainForm.get('categoryId')?.value;
        if (name && name.length > 2 && catId) {
          this.isDuplicate = await this.supabase.checkDuplicate('', catId, [{ value: name }]);
        } else {
          this.isDuplicate = false;
        }
      });

    // 3. OBSŁUGA WYSZUKIWARKI
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((query) => {
      // Przekazujemy zapytanie do refreshQuestions
      this.refreshQuestions(query);
    });
  }

  private initForm() {
    this.mainForm = this.fb.group({
      categoryId: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
      hints: this.fb.array([]),
    });
  }

  private setupAutocompletes() {
    this.filteredCountries = this.mainForm.get('question')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCountries(value || ''))
    );
  }

  async loadInitialData() {
    try {
      const [clubsRes, categoriesData] = await Promise.all([
        this.supabase.getClubs(),
        this.loadCountries(),
        this.supabase.getCategoriesByType(7),
      ]);
      this.allClubs = clubsRes.data || [];
      this.categories = categoriesData || [];
      await this.refreshQuestions();
    } catch (e) {
      console.error('Błąd init:', e);
    }
  }

  async loadCountries() {
    try {
      const data = await firstValueFrom(this.http.get<any[]>('/questions/flag.questions.json'));
      this.availableCountries = data
        .map((f) => ({
          code: f.question.split('/').pop().split('.')[0].toUpperCase(),
          name: f.answers[0].value,
          flagUrl: f.question,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      return this.availableCountries;
    } catch (e) {
      return [];
    }
  }

  private _filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.availableCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(filterValue) || c.code.toLowerCase().includes(filterValue)
    );
  }

  onCountrySelected(event: any) {
    const selected = this.availableCountries.find((c) => c.name === event.option.value);
    if (selected) {
      this.mainForm.get('question')?.setValue(selected.code, { emitEvent: false });
    }
  }

  getFlagUrl(code: string): string {
    if (!code || code.length > 3) return '';
    const country = this.availableCountries.find((c) => c.code === code.toUpperCase());
    return country ? country.flagUrl : '';
  }

  get hints() {
    return this.mainForm.get('hints') as FormArray;
  }

  addClub(clubData: any = { label: '', content: '', penaltyPercent: 0 }) {
    const group = this.fb.group({
      label: [clubData.label || '', Validators.required],
      content: [clubData.content || '', Validators.required],
      penaltyPercent: [clubData.penaltyPercent || 0],
    });

    this.hints.push(group);
    const index = this.hints.length - 1;

    this.filteredClubsSelectors[index] = group.get('label')!.valueChanges.pipe(
      startWith(group.get('label')?.value || ''),
      map((v) => this._filterClubs(v))
    );
  }

  private _filterClubs(value: string): any[] {
    const filterValue = (value || '').toLowerCase();
    return this.allClubs.filter((c) => c.name.toLowerCase().includes(filterValue));
  }

  onClubOptionSelected(event: any, index: number) {
    const clubName = event.option.value;
    const club = this.allClubs.find((c) => c.name === clubName);
    if (club) {
      this.hints.at(index).patchValue({
        label: club.name,
        content: `/footballCrests/${club.file_name}`,
      });
    }
  }

  removeClub(index: number) {
    this.hints.removeAt(index);
    this.filteredClubsSelectors.splice(index, 1);
  }

  async loadQuestionToEdit(id: number) {
    const { data } = await this.supabase.getQuestionById(id);
    if (!data) return;

    this.isEditMode = true;
    this.editingId = id;
    this.hints.clear();
    this.filteredClubsSelectors = [];

    const ans = typeof data.answers === 'string' ? JSON.parse(data.answers) : data.answers;
    const hnts = typeof data.hints === 'string' ? JSON.parse(data.hints) : data.hints;

    this.mainForm.patchValue({
      categoryId: data.category_id,
      question: data.question,
      answer: Array.isArray(ans) ? ans[0]?.value || '' : ans?.value || '',
    });

    if (Array.isArray(hnts)) {
      hnts.forEach((h) => this.addClub(h));
    }

    this.mainForm.markAsPristine();
  }

  // Zmodyfikowana funkcja save() - czystszy payload
  async save() {
    if (this.mainForm.invalid) return;
    this.isSaving = true;

    const rawHints = this.hints.getRawValue();
    const mainVal = this.mainForm.getRawValue();

    const payload = {
      category_id: mainVal.categoryId,
      question: mainVal.question,
      answers: [{ value: mainVal.answer }],
      hints: rawHints.map((h: any) => ({
        label: h.label,
        content: h.content,
        penaltyPercent: h.penaltyPercent || 0,
      })),
      // created_by i updated_by są obsługiwane przez bazę!
    };

    try {
      if (this.isEditMode && this.editingId) {
        await this.supabase.updateQuestion(this.editingId, payload);
      } else {
        await this.supabase.addQuestion(payload);
      }
      this.snackBar.open('Sukces!', 'OK', { duration: 2000 });
      this.resetForm();
      await this.refreshQuestions();
    } catch (err) {
      console.error(err);
    } finally {
      this.isSaving = false;
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.editingId = null;
    this.hints.clear();
    const cat = this.mainForm.get('categoryId')?.value;
    this.mainForm.reset();
    this.mainForm.get('categoryId')?.setValue(cat);
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  async refreshQuestions(search?: string) {
    const catId = this.mainForm.get('categoryId')?.value;

    // Zwiększamy limit, aby pobrać więcej danych do filtrowania w TS
    const { data, error } = await this.supabase.getQuestionsList(1000, catId);

    if (error) {
      console.error('Błąd Supabase:', error);
      return;
    }

    if (data) {
      // 1. Mapujemy dane i bezpiecznie wyciągamy nazwiska (DisplayName)
      let mapped = data.map((q) => {
        let parsedAns: any = [];
        try {
          parsedAns = typeof q.answers === 'string' ? JSON.parse(q.answers) : q.answers || [];
        } catch (e) {
          parsedAns = [];
        }

        // Wyciągamy imię i nazwisko
        const name = Array.isArray(parsedAns)
          ? parsedAns[0]?.value || 'Nieznany'
          : parsedAns?.value || 'Nieznany';

        return {
          ...q,
          displayName: name,
        };
      });

      // 2. Logika filtrowania - TYLKO jeśli wpisano coś w wyszukiwarkę
      if (search && search.trim() !== '') {
        const s = search.toLowerCase().trim();
        const sNormalized = normalizeText(s);

        mapped = mapped.filter((q) => {
          const nameNormalized = normalizeText(q.displayName || '');
          const countryNormalized = (q.question || '').toLowerCase();

          // Sprawdzamy czy pasuje do nazwiska (przez Twoją pomocniczą funkcję)
          const matchByHelper = validateAnswerHelper(s, [q.displayName], []) !== -1;
          // Sprawdzamy czy zawiera się w nazwisku (zwykłe includes)
          const matchByIncludes = nameNormalized.includes(sNormalized);
          // Sprawdzamy kod kraju (np. PL)
          const matchByCountry = countryNormalized.includes(s);

          return matchByHelper || matchByIncludes || matchByCountry;
        });
      }

      // 3. Przypisujemy PRZEFILTROWANĄ listę do zmiennej widocznej w HTML
      this.allQuestions = mapped;

      // DEBUG: sprawdź w konsoli ile znalazło
      console.log(`Znaleziono: ${this.allQuestions.length} dla frazy: "${search || 'brak'}"`);
    }
  }
}
