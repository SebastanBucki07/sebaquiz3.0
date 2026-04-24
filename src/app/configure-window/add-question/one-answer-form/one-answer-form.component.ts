import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './one-answer-form.component.html',
  styleUrls: ['./one-answer-form.component.scss']
})
export class OneAnswerFormComponent implements OnInit {
  questionForm: FormGroup;

  // Przykładowe kategorie, o które prosiłeś
  categories = ['Test', 'tescik20'];

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      category: ['', Validators.required],
      questionText: ['', Validators.required],
      answers: this.fb.array([]) // Dynamiczna lista par label-value
    });
  }

  ngOnInit(): void {
    // Dodajemy pierwszą parę pól na start
    this.addAnswer();
  }

  // Getter dla łatwiejszego dostępu do tablicy odpowiedzi w HTML
  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }

  addAnswer(): void {
    if (this.answers.length < 5) {
      const answerGroup = this.fb.group({
        label: ['', Validators.required],
        value: ['', Validators.required]
      });
      this.answers.push(answerGroup);
    }
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 1) {
      this.answers.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      console.log('Dane do wysłania:', this.questionForm.value);
      // Tutaj w przyszłości wejdzie logika Supabase
    }
  }
}
