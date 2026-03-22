import { Injectable } from '@angular/core';
import { Question } from '../../shared/questions/question.interface';
import { getActorPhotoByName } from '../../shared/apiHelper/actor.helper';

@Injectable({ providedIn: 'root' })
export class QuestionEnricherService {
  async enrich(question: Question, type: string, name: string): Promise<Question> {
    if (type === 'photos' && name === 'Znane postacie') {
      return await this.enrichFamousPeople(question);
    }
    return question;
  }

  private async enrichFamousPeople(question: Question): Promise<Question> {
    const q = question.question;
    if (!q) return question;

    // Logika dla Filmwebu
    if (q.includes('fwcdn.pl')) {
      const actorName = question.answers?.[0]?.value;
      if (!actorName) return question;

      const photo = await getActorPhotoByName(actorName);
      if (photo.includes('no-image')) {
        throw new Error('RETRY_NEEDED'); // Sygnał dla głównego serwisu, by losował dalej
      }
      return { ...question, question: photo };
    }

    // Sprawdzanie czy link HTTP działa
    if (q.startsWith('http') && !(await this.isValidImage(q))) {
      throw new Error('RETRY_NEEDED');
    }

    return question;
  }

  private async isValidImage(url: string): Promise<boolean> {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }
}
