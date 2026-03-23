import { Injectable } from '@angular/core';
import { Question } from '../../shared/questions/question.interface';
import {
  getImageUrl,
  getMovieCast,
  getMovieIdByTitle,
  getTvCast,
  getTvIdByTitle,
} from '../../shared/apiHelper/actor.helper';
import { Hint } from '../../shared/models/category/hint.interface';

@Injectable({ providedIn: 'root' })
export class HintProviderService {
  async fetchHints(question: Question): Promise<Hint[]> {
    if (!question.answers?.length) return [];

    const title = question.answers[0].value;
    const isTv = question.question === 'W jakim serialu zagrała taka obsada?';

    const id = isTv ? await getTvIdByTitle(title) : await getMovieIdByTitle(title);
    if (!id) return [];

    const cast = isTv ? await getTvCast(id, 8) : await getMovieCast(id, 8);

    return cast.map((actor, index) => ({
      id: index.toString(),
      label: actor.name,
      content: actor.profile_path ? getImageUrl(actor.profile_path) : 'assets/no-image.png',
      penaltyPercent: 0,
    }));
  }
}
