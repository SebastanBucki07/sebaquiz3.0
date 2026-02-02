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
import {
  PhotoFragmentsCategoryComponent
} from './game/game-content/game-question-area/photo-fragments-category/photo-fragments-category.component';
import {
  PhotoHintsCategoryComponent
} from './game/game-content/game-question-area/photo-hints-category/photo-hints-category.component';
import {FamiliadaComponent} from './game/game-content/game-question-area/familiada/familiada.component';
import {
  FootballGameCategoryComponent
} from './game/game-content/game-question-area/football-game-category/football-game-category.component';
import {
  TicTacToeCategoryComponent
} from './game/game-content/game-question-area/tic-tac-toe-category/tic-tac-toe-category.component';


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
              { path: 'hints', component: HintsCategoryComponent,data: {
                  hints: [
                    { id: 'first', label: 'Pierwszy fragment', penaltyPercent: 0, content: 'Śród takich pól przed laty...' },
                    { id: 'second', label: 'Drugi fragment', penaltyPercent: 30, content: 'Film został wydany w 1999 roku.' },
                    { id: 'third', label: 'Trzeci fragment', penaltyPercent: 30, content: 'Główną rolę grał Brad Pitt.' }
                  ]
                } },
              { path: 'music', component: MusicCategoryComponent },
              { path: 'one-answer', component: OneAnswerCategoryComponent },
              { path: 'abcd', component: MultipleChoiceCategoryComponent },
              { path: 'writting-category', component: WritingCategoryComponent },
              { path: 'photos', component: PhotosCategoryComponent },
              { path: 'photo-fragments', component: PhotoFragmentsCategoryComponent },
              { path: 'photo-hints', component: PhotoHintsCategoryComponent },
              { path: 'familiada', component: FamiliadaComponent },
              { path: 'footballGame', component: FootballGameCategoryComponent },
              { path: 'ticTacToe', component: TicTacToeCategoryComponent }
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
