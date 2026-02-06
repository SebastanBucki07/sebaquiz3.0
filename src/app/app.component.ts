import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {photoQuiz} from './shared/createPhotoQuestion.helper';
import {flagData} from './shared/createFlagQuestion.helper';
import {transformed} from './shared/createFlagAPIQuestion.helper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sebaquiz3.0';
  //private priv = TEST
  //private priv2 = quizData
  //private priv3 = photoQuiz
  //private priv4 = transformed
}
