import clubDataRaw from '../../../public/footballCrests/mappedClubs.json';

const ASSETS_PATH = 'footballCrests/';

// Typowanie: Klucz to Nazwa Klubu, Wartość to Nazwa Pliku (np. "Real Madrid": "real.png")
const clubData = clubDataRaw as Record<string, string>;

// Mapowanie odwrotne: Klucz to Nazwa Pliku, Wartość to Nazwa Klubu (np. "real.png": "Real Madrid")
const fileToName: Record<string, string> = Object.fromEntries(
  Object.entries(clubData).map(([name, file]) => [file, name])
);

/**
 * Przyjmuje nazwę pliku (np. "barcelona.png") i zwraca nazwę klubu
 */
export const getClubNameByFile = (fileName: string): string => {
  return fileToName[fileName] || 'Unknown Club';
};

/**
 * Twoja oryginalna funkcja z poprawioną logiką ścieżek
 */
export const getClubInfo = (input: string) => {
  const formatLogoPath = (fileName: string) => `${ASSETS_PATH}${fileName}`;

  // Jeśli input to nazwa klubu (np. "Lech Poznań")
  if (clubData[input]) {
    return {
      name: input,
      logo: formatLogoPath(clubData[input]),
    };
  }

  // Jeśli input to nazwa pliku (np. "lech.png")
  if (fileToName[input]) {
    return {
      name: fileToName[input],
      logo: formatLogoPath(input),
    };
  }

  // Fallback
  return {
    name: input,
    logo: formatLogoPath('default-logo.png'),
  };
};
