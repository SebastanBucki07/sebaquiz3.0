import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../../../services/supabase.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-one-answer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './one-answer-form.component.html',
  styleUrls: ['./one-answer-form.component.scss'],
})
export class OneAnswerFormComponent implements OnInit {
  questionForm: FormGroup;
  categories: any[] = [];
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.fb.group({
      category: ['', Validators.required],
      questionText: ['', Validators.required],
      answers: this.fb.array([]),
    });
  }

  async ngOnInit() {
    this.addAnswer();
    try {
      this.categories = await this.supabaseService.getCategoriesByType(1);
    } catch (err) {
      console.error('Nie udało się załadować kategorii');
    } finally {
      this.isLoading = false;
    }
  }

  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }

  addAnswer(): void {
    if (this.answers.length < 5) {
      const answerGroup = this.fb.group({
        label: ['', Validators.required],
        value: ['', Validators.required],
      });
      this.answers.push(answerGroup);
    }
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 1) {
      this.answers.removeAt(index);
    }
  }

  async onSubmit() {
    if (this.questionForm.invalid) return;

    const formValue = this.questionForm.value;

    // Extract data for clarity
    const questionText = formValue.questionText;
    const categoryId = formValue.category;

    try {
      // 1. Check for duplicates in this specific category
      // We wait for the service to tell us if it exists
      const isDuplicate = await this.supabaseService.checkDuplicate(questionText, categoryId);

      if (isDuplicate) {
        this.snackBar.open('To pytanie już istnieje w wybranej kategorii!', 'Duplicate', {
          duration: 5000,
          panelClass: ['warning-snackbar'], // Optional: for custom styling
        });
        return; // Stop execution, do not proceed to insert
      }

      // 2. Prepare data for insert if no duplicate found
      const questionData = {
        category_id: categoryId,
        question: questionText,
        answers: formValue.answers,
        // If this is the hints form, send formValue.hints, otherwise empty array
        hints: formValue.hints || [],
      };

      // 3. Insert into Supabase
      const { error } = await this.supabaseService.addQuestion(questionData);

      if (error) throw error;

      // 4. Success handling
      this.snackBar.open('Pytanie dodane pomyślnie!', 'OK', { duration: 3000 });
      this.resetForm();
    } catch (err: any) {
      console.error('Supabase error:', err);
      this.snackBar.open(`Error: ${err.message}`, 'Close');
    }
  }

  private resetForm() {
    this.questionForm.reset();
    while (this.answers.length) {
      this.answers.removeAt(0);
    }
    this.addAnswer();
  }
}
