import axios from 'axios';
import { BAJKOWE_INTRO } from '../questions/fairyTalesIntros.questions';
import { IMPREZY_SPORTOWE } from '../questions/footballChampionsMusic.questions';
import { JAKA_TO_MELODIA } from '../questions/music.questions';
import { HYMNY_PANSTWOWE } from '../questions/nationalAnthems.questions';
import { CZOLOWKI_SERIALI } from '../questions/tvSeriesIntro.questions';

const SECTIONS = {
  '1) BAJKOWE INTRO': BAJKOWE_INTRO,
  '2) IMPREZY SPORTOWE': IMPREZY_SPORTOWE,
  '3) JAKA TO MELODIA': JAKA_TO_MELODIA,
  '4) HYMNY PAŃSTWOWE': HYMNY_PANSTWOWE,
  '5) CZOŁÓWKI SERIALI': CZOLOWKI_SERIALI,
};

async function validateSection(name: string, questions: any[]) {
  console.log(`\n--- Sprawdzanie sekcji: ${name} (${questions.length} utworów) ---`);

  const broken: any[] = [];

  for (const q of questions) {
    const videoId = q.question;
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    try {
      await axios.get(url);
      process.stdout.write('.'); // Kropka oznacza, że piosenka OK (żeby konsola "żyła")
    } catch (error) {
      process.stdout.write('X'); // X oznacza błąd
      const label = q.answers[0]?.value || 'Brak tytułu';
      broken.push({ ID: q.id, Tytuł: label, YouTubeID: videoId });
    }
  }

  return broken;
}

async function runReport() {
  const finalReport: Record<string, any[]> = {};
  let totalBroken = 0;

  for (const [name, data] of Object.entries(SECTIONS)) {
    const brokenSongs = await validateSection(name, data);
    if (brokenSongs.length > 0) {
      finalReport[name] = brokenSongs;
      totalBroken += brokenSongs.length;
    }
  }

  console.log('\n\n=================================');
  console.log('       RAPORT KOŃCOWY');
  console.log('=================================');

  if (totalBroken === 0) {
    console.log('✅ Gratulacje! Wszystkie piosenki działają.');
  } else {
    for (const [section, songs] of Object.entries(finalReport)) {
      console.log(`\n📍 SEKCJA: ${section}`);
      console.table(songs);
    }
    console.log(`\nSuma niedziałających: ${totalBroken}`);
  }
}

runReport();
