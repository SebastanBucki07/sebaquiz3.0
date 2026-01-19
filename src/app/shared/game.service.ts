import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private resetSubject = new Subject<void>();
  reset$ = this.resetSubject.asObservable();
  
  private dataChangedSubject = new Subject<void>();
  dataChanged$ = this.dataChangedSubject.asObservable();

  constructor() { }

  resetGame() {
    localStorage.removeItem('teams');
    localStorage.removeItem('selectedCategories');
    this.resetSubject.next();
  }

  notifyDataChanged() {
    this.dataChangedSubject.next();
  }
}
