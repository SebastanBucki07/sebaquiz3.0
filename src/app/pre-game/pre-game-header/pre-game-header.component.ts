import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatCardActions} from '@angular/material/card';

@Component({
  selector: 'app-pre-game-header',
  standalone: true,
  templateUrl: './pre-game-header.component.html',
  styleUrl: './pre-game-header.component.css',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatCardActions],
})
export class PreGameHeaderComponent {
  constructor(private router: Router) {}

  goToTeam() {
    this.router.navigate(['choose-team'], { relativeTo: this.router.routerState.root.firstChild?.firstChild });
  }

  goToCategory() {
    this.router.navigate(['choose-category'], { relativeTo: this.router.routerState.root.firstChild?.firstChild });
  }
}
