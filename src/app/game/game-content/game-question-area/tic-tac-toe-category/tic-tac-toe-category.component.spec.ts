import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicTacToeCategoryComponent } from './tic-tac-toe-category.component';
import {footballers} from '../../../../shared/footballers/footballers';
import {getClubInfo} from '../../../../shared/clubMapper';

fdescribe('TicTacToeCategoryComponent', () => {
  let component: TicTacToeCategoryComponent;
  let fixture: ComponentFixture<TicTacToeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicTacToeCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('wygeneruj JSON dla brakujących klubów (tylko te, które wystąpiły więcej niż 2 razy)', () => {
    // Mapa: [nazwa_klubu] -> liczba_wystąpień
    const clubCounts: Record<string, number> = {};

    // 1. Zliczamy wszystkie wystąpienia klubów, których brakuje w mapperze
    footballers.forEach(player => {
      player.clubs.forEach(clubName => {
        const info = getClubInfo(clubName);
        if (info.logo.includes('default-logo.png')) {
          clubCounts[clubName] = (clubCounts[clubName] || 0) + 1;
        }
      });
    });

    // 2. Filtrujemy kluby, które wystąpiły > 2 razy
    const frequentMissingClubs = Object.keys(clubCounts)
    .filter(club => clubCounts[club] > 2)
    .sort();

    if (frequentMissingClubs.length > 0) {
      const jsonPatch: Record<string, string> = {};

      console.warn(`🚀 ZNALEZIONO ${frequentMissingClubs.length} POPULARNYCH KLUBÓW (> 2 wystąpienia):`);

      frequentMissingClubs.forEach(club => {
        jsonPatch[club] = "TU_WPISZ_NAZWE_PLIKU.png";
        // Opcjonalnie logujemy ile razy dany klub wystąpił
        console.log(`📊 ${club}: występuje ${clubCounts[club]} razy`);
      });

      console.warn('📋 GOTOWY JSON DO SKOPIOWANIA:');
      console.log(JSON.stringify(jsonPatch, null, 2));
    } else {
      console.log('✅ Brak popularnych brakujących klubów (> 2 wystąpienia).');
    }

    // Opcjonalnie: logujemy te rzadkie, żeby o nich nie zapomnieć zupełnie
    const rareMissing = Object.keys(clubCounts).filter(club => clubCounts[club] <= 2);
    if (rareMissing.length > 0) {
      console.log(`ℹ️ Pominięto ${rareMissing.length} rzadkich klubów (występują 1-2 razy).`);
    }

    // Test przechodzi, jeśli nie ma popularnych braków (możesz to zmienić na 0, jeśli chcesz rygoru)
    expect(frequentMissingClubs.length).toBe(0);
  });
});
