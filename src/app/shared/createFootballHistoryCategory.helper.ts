import clubDataRaw from '../../../public/footballCrests/mappedClubs.json';
import { footballers } from './footballers/footballers';
import { FLAGI } from './questions/flag.questions';

// --- KONFIGURACJA ---
const ASSETS_PATH = '/footballCrests/'; // Dodajemy slash na początku dla ścieżek w przeglądarce
const clubData = clubDataRaw as Record<string, string>;

// Twoje surowe dane z pierwszego pytania
const rawFootballers = footballers;

// --- KONFIGURACJA WYJĄTKÓW ---
const COUNTRY_EXCEPTIONS: Record<string, string> = {
  Anglia: 'https://flagcdn.com/w320/gb-eng.png',
  'Wybrzeże Kości Słoniowej': 'https://flagcdn.com/w320/ci.png',
  Walia: 'https://flagcdn.com/w320/gb-wls.png',
  Szkocja: 'https://flagcdn.com/w320/gb-sct.png',
  USA: 'https://flagcdn.com/w320/us.png',
  'Demokratyczna Republika Kongo': 'https://flagcdn.com/w320/cd.png',
};

export const generateFootballHistory = () => {
  const countryToFlagMap: Record<string, string> = {};

  // Mapowanie bazowe z FLAGI
  FLAGI.forEach((item) => {
    const countryName = item.answers[0].value.trim();
    countryToFlagMap[countryName] = item.question;
  });

  const finalData = rawFootballers.map((player) => {
    const p = player as any;
    const countryName = p.country?.trim();

    // Logika wyboru flagi: Wyjątki -> Mapa bazowa -> UN
    let flagUrl = COUNTRY_EXCEPTIONS[countryName];

    if (!flagUrl) {
      flagUrl = countryToFlagMap[countryName] || 'https://flagcdn.com/w320/un.png';
    }

    return {
      id: player.id,
      answers: [{ value: player.name }],
      question: flagUrl,
      hints: player.clubs.map((clubName, index) => {
        const logoFile = clubData[clubName] || 'default-logo.png';
        return {
          id: index.toString(),
          label: clubName,
          content: `${ASSETS_PATH}${logoFile}`,
          penaltyPercent: 0,
        };
      }),
      revealedAnswers: [],
      showAnswer: false,
    };
  });

  // --- TO CIĘ INTERESUJE ---
  console.log('🚀 GOTOWE OBIEKTY DO SKOPIOWANIA:');
  console.log(JSON.stringify(finalData, null, 2));

  // Dodatkowo info o błędach, żebyś wiedział czy coś jeszcze dopisać do wyjątków
  const errors = finalData.filter((d) => d.question.includes('un.png'));
  if (errors.length > 0) {
    console.warn(`⚠️ Znaleziono ${errors.length} obiektów z flagą UN.png`);
  }

  return finalData;
};
