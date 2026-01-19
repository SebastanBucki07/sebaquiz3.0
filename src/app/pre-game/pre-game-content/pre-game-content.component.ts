import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-pre-game-content',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './pre-game-content.component.html',
  styleUrl: './pre-game-content.component.css'
})
export class PreGameContentComponent {}
