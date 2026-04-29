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
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../../../services/supabase.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-football-form',
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
  ],
  templateUrl: './football-form.component.html',
  styleUrls: ['./football-form.component.css'],
})
export class FootballFormComponent implements OnInit {
  mainForm!: FormGroup;
  rawInput1 = '';
  rawInput2 = '';
  isSaving = false;

  categories: any[] = [];
  availableCountries: any[] = [];
  activeSections = { raw: true, starters: true, bench: false };

  commonFormations: string[] = [
    '1-4-4-2',
    '1-4-3-3',
    '1-4-2-3-1',
    '1-4-1-4-1',
    '1-3-4-3',
    '1-3-5-2',
    '1-5-3-2',
    '1-5-4-1',
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.mainForm = this.fb.group({
      categoryId: ['', Validators.required],
      matchInfo: ['', Validators.required],
      team1: this.initTeam(),
      team2: this.initTeam(),
    });

    this.ensureMinPlayers();
    await Promise.all([this.loadCountries(), this.loadCategories()]);
  }

  private initTeam(): FormGroup {
    return this.fb.group({
      formation: ['1-4-3-3'],
      footballers: this.fb.array([]),
      substitutes: this.fb.array([]),
    });
  }

  async loadCategories() {
    try {
      // Typ 11 zarezerwowany dla składów piłkarskich
      this.categories = await this.supabase.getCategoriesByType(9);
    } catch (e) {
      this.snackBar.open('Błąd ładowania kategorii', 'Zamknij', { duration: 3000 });
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
    } catch (e) {
      console.error('Błąd ładowania flag:', e);
    }
  }

  getArray(team: string, type: 'footballers' | 'substitutes'): FormArray {
    return this.mainForm.get(team)?.get(type) as FormArray;
  }

  getFlagUrl(code: string): string {
    if (!code) return '';
    const country = this.availableCountries.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );
    return country ? country.flagUrl : '';
  }

  toggleSection(section: keyof typeof this.activeSections) {
    this.activeSections[section] = !this.activeSections[section];
  }

  // SZYBKI IMPORT
  onRawInputChange(teamNum: number) {
    const raw = teamNum === 1 ? this.rawInput1 : this.rawInput2;
    const teamKey = `team${teamNum}`;
    const lines = raw.split('\n').filter((l) => l.trim());

    this.fillArrayFromLines(teamKey, 'footballers', lines.slice(0, 11), 1, 11);
    this.fillArrayFromLines(teamKey, 'substitutes', lines.slice(11), 15, 0);
  }

  private fillArrayFromLines(
    team: string,
    type: 'footballers' | 'substitutes',
    lines: string[],
    startPos: number,
    min: number
  ) {
    const arr = this.getArray(team, type);
    arr.clear();

    lines.forEach((l: string, i: number) => {
      const cMatch = l.match(/\(([^)]+)\)/);
      const surname = l.replace(/\([^)]+\)/, '').trim();
      if (surname) {
        this.addPlayer(arr, startPos + i, {
          surname,
          country: cMatch ? cMatch[1].toUpperCase() : 'PL',
        });
      }
    });

    if (type === 'footballers') {
      while (arr.length < min) this.addPlayer(arr, startPos + arr.length);
    }
  }

  private addPlayer(arr: FormArray, pos: number, data: any = {}) {
    arr.push(
      this.fb.group({
        surname: [data.surname || ''],
        country: [data.country || 'PL'],
        position: [data.position || pos],
      })
    );
  }

  addBenchPlayer(team: string) {
    const arr = this.getArray(team, 'substitutes');
    this.addPlayer(arr, arr.length + 15);
  }

  removeBenchPlayer(team: string, index: number) {
    this.getArray(team, 'substitutes').removeAt(index);
  }

  private ensureMinPlayers() {
    ['team1', 'team2'].forEach((t) => {
      const starters = this.getArray(t, 'footballers');
      while (starters.length < 11) this.addPlayer(starters, starters.length + 1);
    });
  }

  // PODGLĄD BOISKA
  getRowsForPreview(teamKey: string): any[][] {
    const team = this.mainForm.get(teamKey);
    const players = team?.get('footballers')?.value || [];
    const formation = team?.get('formation')?.value || '1-4-3-3';

    if (players.length === 0) return [];

    // Parsowanie formacji (np. 1-4-3-3 -> [1, 4, 3, 3])
    const parts = formation.split('-').map((n: string) => parseInt(n));
    const rows: any[][] = [];
    let currentIndex = 0;

    parts.forEach((count: number) => {
      const row = players.slice(currentIndex, currentIndex + count);
      if (row.length > 0) rows.push(row);
      currentIndex += count;
    });

    // Jeśli zostali jacyś zawodnicy poza formacją (bezpiecznik)
    if (currentIndex < players.length) {
      rows.push(players.slice(currentIndex));
    }

    // Drużyna dolna (team2) wyświetlana w lustrzanym odbiciu (bramkarz na dole)
    return teamKey === 'team1' ? rows : [...rows].reverse();
  }

  async save() {
    if (this.mainForm.invalid) {
      this.snackBar.open('Uzupełnij wymagane pola!', 'Błąd');
      return;
    }

    this.isSaving = true;
    const formVal = this.mainForm.getRawValue();

    try {
      const payload = {
        category_id: formVal.categoryId,
        question: formVal.matchInfo,
        answers: [
          {
            value: formVal.matchInfo.split('(')[0].trim(),
            football: {
              firstTeam: formVal.team1,
              secondTeam: formVal.team2,
            },
          },
        ],
        revealed_answers: [],
        hints: [],
      };

      const { error } = await this.supabase.addQuestion(payload);
      if (error) throw error;

      this.snackBar.open('Skład zapisany pomyślnie!', 'Sukces');
    } catch (e: any) {
      this.snackBar.open(`Błąd: ${e.message}`, 'Zamknij');
    } finally {
      this.isSaving = false;
    }
  }
}
