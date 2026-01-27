import {Routes} from '@angular/router';
import {MainComponent} from './main/main.component';
import {GameComponent} from './game/game.component';
import {ChooseTeamComponent} from "./pre-game/choose-team/choose-team.component";
import {ChooseCategoryComponent} from "./pre-game/choose-category/choose-category.component";
import {PreGameComponent} from "./pre-game/pre-game.component";
import {GameContentComponent} from './game/game-content/game-content.component';
import {GameQuestionAreaComponent} from './game/game-content/game-question-area/game-question-area.component';
import {HintsCategoryComponent} from './game/game-content/game-question-area/hints-category/hints-category.component';
import {MusicCategoryComponent} from './game/game-content/game-question-area/music-category/music-category.component';
import {
  OneAnswerCategoryComponent
} from './game/game-content/game-question-area/one-answer-category/one-answer-category.component';
import {
  MultipleChoiceCategoryComponent
} from './game/game-content/game-question-area/multiple-choice-category/multiple-choice-category.component';
import {
  WritingCategoryComponent
} from './game/game-content/game-question-area/writing-category/writing-category.component';
import {
  PhotosCategoryComponent
} from './game/game-content/game-question-area/photos-category/photos-category.component';


export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'game', pathMatch: 'full' },
      {
        path: 'game',
        component: GameComponent,
        children: [
          { path: '', component: GameContentComponent },

          // Tutaj GameQuestionAreaComponent z child routes
          {
            path: 'category/:type/:name',
            component: GameQuestionAreaComponent,
            children: [
              { path: '', redirectTo: 'default', pathMatch: 'full' }, // opcjonalnie
              { path: 'hints', component: HintsCategoryComponent },
              { path: 'music', component: MusicCategoryComponent },
              { path: 'one-answer', component: OneAnswerCategoryComponent },
              { path: 'abcd', component: MultipleChoiceCategoryComponent },
              { path: 'wpisywanie', component: WritingCategoryComponent },
              { path: 'photos', component: PhotosCategoryComponent }
            ]
          }
        ]
      },
      {
        path: 'pregame',
        component: PreGameComponent,
        children: [
          { path: '', redirectTo: 'choose-team', pathMatch: 'full' },
          { path: 'choose-team', component: ChooseTeamComponent },
          { path: 'choose-category', component: ChooseCategoryComponent }
        ]
      }
    ]
  }
];
