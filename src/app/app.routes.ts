import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: '',
//     component: MainComponent,
//     children: [
//       // 1. STRONA STARTOWA (Lądujesz tutaj po wejściu na adres /)
//       {
//         path: '',
//         component: HomeComponent,
//       },
//
//       // 2. MODUŁ GRY (Dostępny pod /game)
//       {
//         path: 'game',
//         component: GameComponent,
//         children: [
//           { path: '', component: GameContentComponent },
//           {
//             path: 'category/:type/:name',
//             component: GameQuestionAreaComponent,
//             children: [

//
//       // 3. KONFIGURACJA (Dostępna pod /pregame)
//       {
//         path: 'pregame',
//         component: PreGameComponent,
//         children: [
//           { path: '', redirectTo: 'choose-team', pathMatch: 'full' },
//           { path: 'choose-team', component: ChooseTeamComponent },
//           { path: 'choose-category', component: ChooseCategoryComponent },
//         ],
//       },
//     ],
//   },
//   // Catch-all: jeśli ktoś wpisze bzdury w URL, wróć do strony startowej
//   { path: '**', redirectTo: '' },
// ];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./main/main.component').then((m) => m.MainComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'configure',
        loadComponent: () =>
          import('./configure-window/configure-window.component').then(
            (m) => m.ConfigureWindowComponent
          ),
        children: [
          { path: '', redirectTo: 'add-category', pathMatch: 'full' },
          {
            path: 'add-category',
            loadComponent: () =>
              import('./configure-window/add-category/add-category.component').then(
                (m) => m.AddCategoryComponent
              ),
          },
          {
            path: 'add-question',
            loadComponent: () =>
              import('./configure-window/add-question/add-question.component').then(
                (m) => m.AddQuestionComponent
              ),
          },
        ],
      },
      {
        path: 'game',
        loadComponent: () => import('./game/game.component').then((m) => m.GameComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./game/game-content/game-content.component').then(
                (m) => m.GameContentComponent
              ),
          },
          {
            path: 'category/:type/:name',
            loadComponent: () =>
              import('./game/game-content/game-question-area/game-question-area.component').then(
                (m) => m.GameQuestionAreaComponent
              ),
            children: [
              { path: '', redirectTo: 'default', pathMatch: 'full' },
              {
                path: 'hints',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/hints-category/hints-category.component').then(
                    (m) => m.HintsCategoryComponent
                  ),
              },
              {
                path: 'music',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/music-category/music-category.component').then(
                    (m) => m.MusicCategoryComponent
                  ),
              },
              {
                path: 'abcd',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/multiple-choice-category/multiple-choice-category.component').then(
                    (m) => m.MultipleChoiceCategoryComponent
                  ),
              },
              {
                path: 'one-answer',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/one-answer-category/one-answer-category.component').then(
                    (m) => m.OneAnswerCategoryComponent
                  ),
              },
              {
                path: 'writting-category',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/writing-category/writing-category.component').then(
                    (m) => m.WritingCategoryComponent
                  ),
              },
              {
                path: 'photos',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/photos-category/photos-category.component').then(
                    (m) => m.PhotosCategoryComponent
                  ),
              },
              {
                path: 'photo-fragments',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/photo-fragments-category/photo-fragments-category.component').then(
                    (m) => m.PhotoFragmentsCategoryComponent
                  ),
              },
              {
                path: 'photo-hints',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/photo-hints-category/photo-hints-category.component').then(
                    (m) => m.PhotoHintsCategoryComponent
                  ),
              },
              {
                path: 'familiada',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/familiada/familiada.component').then(
                    (m) => m.FamiliadaComponent
                  ),
              },
              {
                path: 'footballGame',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/football-game-category/football-game-category.component').then(
                    (m) => m.FootballGameCategoryComponent
                  ),
              },
              {
                path: 'ticTacToe',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/tic-tac-toe-category/tic-tac-toe-category.component').then(
                    (m) => m.TicTacToeCategoryComponent
                  ),
              },
              {
                path: 'country',
                loadComponent: () =>
                  import('./game/game-content/game-question-area/country-guess-category/country-guess-category.component').then(
                    (m) => m.CountryGuessCategoryComponent
                  ),
              },
            ],
          },
        ],
      },
      {
        path: 'pregame',
        loadComponent: () =>
          import('./pre-game/pre-game.component').then((m) => m.PreGameComponent),
        children: [
          { path: '', redirectTo: 'choose-team', pathMatch: 'full' },
          {
            path: 'choose-team',
            loadComponent: () =>
              import('./pre-game/choose-team/choose-team.component').then(
                (m) => m.ChooseTeamComponent
              ),
          },
          {
            path: 'choose-category',
            loadComponent: () =>
              import('./pre-game/choose-category/choose-category.component').then(
                (m) => m.ChooseCategoryComponent
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
