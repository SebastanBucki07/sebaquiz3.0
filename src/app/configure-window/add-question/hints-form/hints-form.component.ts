
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// PAMIĘTAJ O TYCH IMPORTACH MATERIALA
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-hints-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatTooltipModule
  ],
  templateUrl: './hints-form.component.html',
  styleUrls: ['./hints-form.component.scss']
})
export class HintsFormComponent {
}
