import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { MATERIAL_IMPORTS } from '../../shared/material';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  imports: [ReactiveFormsModule, MATERIAL_IMPORTS],
  styleUrls: ['./add-question.component.scss'],
})
export class AddQuestionComponent {
  questionForm: FormGroup;

  // Lista Twoich kategorii - możesz ją rozbudowywać
  categories = [
    'BIOLOGIA',
    'FILMY',
    'TV_SERIES',
    'GRY',
    'CHEMIST',
    'BOGOWIE',
    'HISTORIA',
    'FIZYKA',
    'STADIONY',
    'TEST',
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    this.questionForm = this.fb.group({
      category: ['BIOLOGIA', Validators.required],
      question: ['', Validators.required],
      answers: this.fb.array([this.createAnswerField()]),
      hints: this.fb.array([]),
    });
  }

  // --- GETTERY DLA FORMULARZA ---
  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }

  get hints() {
    return this.questionForm.get('hints') as FormArray;
  }

  // --- METODY DLA ODPOWIEDZI ---
  createAnswerField(): FormGroup {
    return this.fb.group({
      label: [''], // np. "Reżyser" lub puste dla prostych pytań
      value: ['', Validators.required],
    });
  }

  addAnswer() {
    this.answers.push(this.createAnswerField());
  }

  removeAnswer(index: number) {
    if (this.answers.length > 1) {
      this.answers.removeAt(index);
    }
  }

  // --- METODY DLA PODPOWIEDZI ---
  addHint() {
    const hintGroup = this.fb.group({
      label: ['Podpowiedź ' + (this.hints.length + 1)],
      content: ['', Validators.required],
      penaltyPercent: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
    this.hints.push(hintGroup);
  }

  removeHint(index: number) {
    this.hints.removeAt(index);
  }

  // --- WYSYŁKA DO BAZY ---
  async onSubmit() {
    if (this.questionForm.invalid) return;

    const formValue = this.questionForm.value;

    // Przygotowanie danych do Supabase
    const payload = {
      category: formValue.category,
      question: formValue.question,
      answers: formValue.answers,
      hints: formValue.hints,
    };

    try {
      const { data, error } = await this.supabaseService.addQuestion(payload);

      if (error) throw error;

      alert('Pytanie dodane pomyślnie!');

      // Resetowanie formularza do stanu początkowego
      this.questionForm.reset({
        category: formValue.category,
        question: '',
        answers: [],
        hints: [],
      });

      // Przywrócenie jednego pola odpowiedzi po resecie
      while (this.answers.length > 0) this.answers.removeAt(0);
      while (this.hints.length > 0) this.hints.removeAt(0);
      this.addAnswer();
    } catch (err: any) {
      console.error('Błąd:', err);
      alert('Wystąpił błąd: ' + err.message);
    }
  }
}
