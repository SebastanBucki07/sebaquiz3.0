import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-club-photo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './club-photo-form.component.html',
  styleUrl: './club-photo-form.component.css',
})
export class ClubPhotoFormComponent {
  newClubName: string = '';
  selectedFile: File | null = null;
  isUploading: boolean = false;
  previewUrl: string | null = null;

  constructor(
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    if (file) {
      this.selectedFile = file;
      // Generowanie podglądu zdjęcia przed wysłaniem
      const reader = new FileReader();
      reader.onload = (e: any) => (this.previewUrl = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  async saveNewClub() {
    if (!this.selectedFile || !this.newClubName) {
      this.snackBar.open('Wypełnij nazwę i wybierz herb!', 'OK', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    try {
      // Przekazujemy nową nazwę klubu do serwisu, by stworzyć ładny plik
      const storagePath = await this.supabase.uploadCrest(this.selectedFile, this.newClubName);

      const { error } = await this.supabase.addNewClub(this.newClubName, storagePath);
      if (error) throw error;

      this.snackBar.open('Klub i herb dodane pomyślnie!', 'Super', {
        duration: 3000,
        panelClass: ['success-snackbar'], // Opcjonalnie: zielony styl
      });

      this.reset();
    } catch (err: any) {
      // KLUCZOWA ZMIANA:
      // err.message to będzie tekst: "Klub o takiej nazwie ma już swój herb w bazie!"
      console.error('Szczegóły błędu:', err);

      this.snackBar.open(err.message || 'Wystąpił błąd podczas zapisu', 'Zamknij', {
        duration: 5000, // Dłuższy czas, żeby zdążyć przeczytać
        panelClass: ['error-snackbar'], // Opcjonalnie: czerwony styl
      });
    } finally {
      this.isUploading = false;
    }
  }

  reset() {
    this.newClubName = '';
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
