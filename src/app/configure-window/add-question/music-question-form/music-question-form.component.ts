import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupabaseService } from '../../../services/supabase.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-music-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinner
  ],
  templateUrl: './music-question-form.component.html',
  styleUrls: ['./music-question-form.component.scss'],
})
export class MusicQuestionFormComponent implements OnInit {
  questionForm: FormGroup;
  categories: any[] = [];
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.fb.group({
      category: ['', Validators.required],
      // W muzyce questionText to zazwyczaj ID filmu YouTube lub URL
      questionText: ['', [Validators.required, Validators.minLength(3)]],
      answers: this.fb.array([]),
    });
  }

  async ngOnInit() {
    this.addAnswer('Tytuł'); // Domyślne pole dla muzyki
    this.addAnswer('Autor'); // Drugie domyślne pole

    try {
      const allCats = await this.supabaseService.getCategories();
      this.categories = allCats.filter(c => c.type_id === 3);
    } catch (err) {
      this.snackBar.open('Błąd ładowania kategorii', 'OK');
    } finally {
      this.isLoading = false;
    }
  }

  // Dodaj te pola do klasy
  videoTitle: string | null = null;

// Zaktualizuj metodę extractVideoId o wywołanie pobierania tytułu
  onUrlChange(url: string) {
    const videoId = this.extractVideoId(url);
    if (videoId && videoId.length === 11) {
      this.fetchVideoTitle(videoId);
    } else {
      this.videoTitle = null;
    }
  }

  async fetchVideoTitle(videoId: string) {
    try {
      // Korzystamy z publicznego punktu oEmbed YouTube (nie wymaga API KEY)
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (response.ok) {
        const data = await response.json();
        this.videoTitle = data.title;
      }
    } catch (err) {
      console.error('Nie udało się pobrać tytułu:', err);
      this.videoTitle = 'Nie znaleziono tytułu';
    }
  }

  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }

  addAnswer(labelValue: string = ''): void {
    const answerGroup = this.fb.group({
      label: [labelValue, Validators.required],
      value: ['', Validators.required],
    });
    this.answers.push(answerGroup);
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 1) {
      this.answers.removeAt(index);
    }
  }

  // Dodaj tę metodę do klasy MusicQuestionFormComponent
  protected extractVideoId(url: string): string {
    // Regex obsługujący: youtube.com, youtu.be, youtube.com/embed/
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);

    // Jeśli dopasowano i ID ma 11 znaków (standard YouTube)
    return (match && match[7].length === 11) ? match[7] : url;
  }

  async onSubmit() {
    if (this.questionForm.invalid) return;

    this.isSaving = true;
    const { category, questionText, answers } = this.questionForm.value;

    // TUTAJ: Automatyczna konwersja linku na samo ID
    const videoId = this.extractVideoId(questionText);

    try {
      // Sprawdzamy duplikat na podstawie czystego ID
      const isDuplicate = await this.supabaseService.checkDuplicate(videoId, category);

      if (isDuplicate) {
        this.snackBar.open('Ten utwór (ID: ' + videoId + ') już jest w bazie!', 'DUBEL', { duration: 4000 });
        this.isSaving = false;
        return;
      }

      const questionData = {
        category_id: category,
        question: videoId, // Zapisujemy tylko czyste ID (np. E1OjQ_3kh4A)
        answers: answers,
        hints: []
      };

      const { error } = await this.supabaseService.addQuestion(questionData);
      if (error) throw error;

      this.snackBar.open(`Dodano utwór (ID: ${videoId})`, 'OK', { duration: 3000 });
      this.resetForm();
    } catch (err: any) {
      this.snackBar.open(`Błąd: ${err.message}`, 'Zamknij');
    } finally {
      this.isSaving = false;
    }
  }

  private resetForm() {
    this.questionForm.reset();
    while (this.answers.length) this.answers.removeAt(0);
    this.addAnswer('Tytuł');
    this.addAnswer('Autor');
  }
}
