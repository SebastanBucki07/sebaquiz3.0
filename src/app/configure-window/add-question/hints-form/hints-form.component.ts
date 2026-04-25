import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-hints-form',
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
    MatSliderModule,
  ],
  templateUrl: './hints-form.component.html',
  styleUrls: ['./hints-form.component.scss'],
})
export class HintsFormComponent implements OnInit {
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
      hints: this.fb.array([]),
    });
  }

  async ngOnInit() {
    this.addAnswer();
    this.addHint();
    try {
      this.categories = await this.supabaseService.getCategoriesByType(5);
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }
  get hints() {
    return this.questionForm.get('hints') as FormArray;
  }

  addAnswer() {
    if (this.answers.length < 5) {
      const answerGroup = this.fb.group({
        label: ['', Validators.required],
        value: ['', Validators.required],
      });
      this.answers.push(answerGroup);
    }
  }

  removeAnswer(index: number) {
    if (this.answers.length > 1) {
      this.answers.removeAt(index);
    }
  }

  addHint() {
    if (this.hints.length < 5) {
      const hintNumber = this.hints.length + 1;
      this.hints.push(
        this.fb.group({
          id: [`hint${hintNumber}`], // Technical ID
          label: [`Podpowiedź ${hintNumber}`, Validators.required], // Default label changed
          content: ['', Validators.required],
          penaltyPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        })
      );
    }
  }

  removeHint(index: number) {
    this.hints.removeAt(index);
  }

  async onSubmit() {
    if (this.questionForm.invalid) return;

    const formValue = this.questionForm.value;

    // 1. Extract data for duplicate checking
    const questionText = formValue.questionText;
    const categoryId = formValue.category;

    try {
      // 2. Check for duplicates in this category before saving
      const isDuplicate = await this.supabaseService.checkDuplicate(questionText, categoryId);

      if (isDuplicate) {
        this.snackBar.open('To pytanie już istnieje w tej kategorii!', 'Duplicate', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
        });
        return; // Stop execution
      }

      // 3. Prepare data object with both answers and hints
      const questionData = {
        category_id: categoryId,
        question: questionText,
        answers: formValue.answers, // Array of {label, value}
        hints: formValue.hints, // Array of {id, label, content, penaltyPercent}
      };

      // 4. Save to Supabase
      const { error } = await this.supabaseService.addQuestion(questionData);

      if (error) throw error;

      // 5. Success handling
      this.snackBar.open('Pytanie z podpowiedziami zapisane!', 'OK', { duration: 3000 });

      // Reset form and maintain default structure (if you have a custom reset method)
      this.questionForm.reset();
    } catch (err: any) {
      console.error('Save error:', err);
      this.snackBar.open(`Błąd: ${err.message}`, 'Zamknij');
    }
  }
}
