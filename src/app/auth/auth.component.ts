import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupabaseService } from '../services/supabase.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIcon,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  loginEmail = '';
  loginPass = '';
  user: any = null;

  constructor(
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    // Sprawdź przy starcie, czy użytkownik jest już zalogowany
    this.user = await this.supabase.getCurrentUser();
  }

  async login() {
    if (!this.loginEmail || !this.loginPass) {
      this.snackBar.open('Wypełnij wszystkie pola!', 'OK', { duration: 3000 });
      return;
    }

    const { data, error } = await this.supabase.signIn(this.loginEmail, this.loginPass);

    if (error) {
      this.snackBar.open('Błąd logowania: ' + error.message, 'OK', { duration: 3000 });
    } else {
      this.user = data.user;
      this.snackBar.open('Zalogowano pomyślnie!', 'OK', { duration: 3000 });
      // Tutaj możesz dodać przekierowanie np. router.navigate(['/form'])
    }
  }

  async logout() {
    await this.supabase.signOut();
    this.user = null;
    this.snackBar.open('Wylogowano', 'OK', { duration: 3000 });
  }
}
