import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {HeaderComponent} from "../header/header.component";
import {GameComponent} from '../game/game.component';

@Component({
  selector: 'app-main',
  imports: [
    FooterComponent,
    HeaderComponent,
    GameComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
