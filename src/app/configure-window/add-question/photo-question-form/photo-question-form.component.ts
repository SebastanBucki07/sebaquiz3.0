import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-photo-question-form',
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
    MatSliderModule,
  ],
  templateUrl: './photo-question-form.component.html',
  styleUrls: ['./photo-question-form.component.css'],
})
export class PhotoQuestionFormComponent implements OnInit {
  questionForm!: FormGroup;
  categories: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  async ngOnInit() {
    this.categories = await this.supabase.getCategoriesByType(4);
  }

  private initForm() {
    this.questionForm = this.fb.group({
      categoryId: [null, Validators.required],
      answerValue: ['', Validators.required],
      hints: this.fb.array([]),
    });
  }

  get hints() {
    return this.questionForm.get('hints') as FormArray;
  }

  addHint() {
    this.hints.push(
      this.fb.group({
        label: ['', Validators.required],
        content: ['', Validators.required],
        penaltyPercent: [10],
      })
    );
  }

  removeHint(index: number) {
    this.hints.removeAt(index);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => (this.previewUrl = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.questionForm.invalid || !this.selectedFile) return;
    this.isSaving = true;
    try {
      const formVal = this.questionForm.getRawValue();
      const category = this.categories.find((c) => c.id === formVal.categoryId);

      let bucket = 'general';
      const catName = category?.name.toLowerCase() || '';
      if (catName.includes('budowle')) bucket = 'buildings';
      else if (catName.includes('klub')) bucket = 'footballCrestes';
      else if (catName.includes('seba')) bucket = 'tests';
      const fileName = await this.supabase.uploadPhoto(
        this.selectedFile,
        formVal.answerValue,
        bucket
      );
      const publicUrl = this.supabase.getPublicUrlFromBucket(bucket, fileName);

      const payload = {
        category_id: formVal.categoryId,
        question: publicUrl,
        answers: [{ label: 'odpowiedz', value: formVal.answerValue }],
        hints: formVal.hints,
      };

      await this.supabase.addQuestion(payload);
      this.snackBar.open('Pytanie dodane!', 'OK');
      this.reset();
    } catch (err) {
      this.snackBar.open('Błąd zapisu', 'X');
    } finally {
      this.isSaving = false;
    }
  }

  reset() {
    this.questionForm.reset();
    this.hints.clear();
    this.previewUrl = null;
    this.selectedFile = null;
  }
}
