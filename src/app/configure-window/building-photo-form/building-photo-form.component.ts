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

@Component({
  selector: 'app-building-photo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './building-photo-form.component.html',
  styleUrls: ['./building-photo-form.component.css'],
})
export class BuildingPhotoFormComponent {
  name: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading = false;

  constructor(
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => (this.previewUrl = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  async save() {
    if (!this.selectedFile || !this.name) {
      this.snackBar.open('Wypełnij wszystkie pola!', 'OK', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    try {
      // 1. Upload pliku
      const storagePath = await this.supabase.uploadBuilding(this.selectedFile, this.name);

      // 2. Zapis do bazy
      const { error } = await this.supabase.addNewBuilding(this.name, storagePath);
      if (error) throw error;

      this.snackBar.open('Budynek dodany pomyślnie!', 'Super', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      this.reset();
    } catch (err: any) {
      this.snackBar.open(err.message || 'Błąd zapisu', 'Zamknij', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isUploading = false;
    }
  }

  reset() {
    this.name = '';
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
