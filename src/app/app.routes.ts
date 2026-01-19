import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { GameComponent } from './game/game.component';
import {ChooseTeamComponent} from "./pre-game/choose-team/choose-team.component";
import {ChooseCategoryComponent} from "./pre-game/choose-category/choose-category.component";
import {PreGameComponent} from "./pre-game/pre-game.component";


export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'game', pathMatch: 'full' },
            { path: 'game', component: GameComponent },
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
