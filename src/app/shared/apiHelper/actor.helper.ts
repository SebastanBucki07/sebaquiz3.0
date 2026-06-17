import { environment } from '../../../environments/environment.prod';
import { TMDBPerson } from '../models/TMDB/tmdbPerson.interface';

// Wyciągamy krótki klucz z environment
const API_KEY = environment.apiToken;

export function getImageUrl(filePath: string | null, size = 'w500'): string {
  if (!filePath) return 'assets/no-image.png'; // placeholder
  const baseUrl = 'https://image.tmdb.org/t/p/';
  return `${baseUrl}${size}${filePath}`;
}

export async function getMovieIdByTitle(title: string): Promise<number | null> {
  try {
    if (!title) return null;
    const cleanTitle = title.trim();

    // Krok 1: Próba wyszukania z lokalizacją pl-PL (Autoryzacja przez URL usuwa CORS)
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=pl-PL&page=1`;
    let res = await fetch(url);
    let json = await res.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].id;
    }

    // Krok 2: Fallback - ogólnie bez języka
    url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(cleanTitle)}&page=1`;
    res = await fetch(url);
    json = await res.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].id;
    }

    // Krok 3: Ostateczny Fallback - upraszczamy tytuł
    const simplifiedTitle = cleanTitle.split(':')[0].split('-')[0].trim();
    if (simplifiedTitle !== cleanTitle) {
      console.log(`[TMDB] Upraszczam wyszukiwanie filmu do: ${simplifiedTitle}`);
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(simplifiedTitle)}&page=1`;
      res = await fetch(url);
      json = await res.json();

      if (json.results && json.results.length > 0) {
        return json.results[0].id;
      }
    }

    console.warn(`[TMDB] Całkowity brak wyników w API dla filmu: ${title}`);
    return null;
  } catch (err) {
    console.warn(`getMovieIdByTitle failed for title: ${title}`, err);
    return null;
  }
}

export async function getTvIdByTitle(title: string): Promise<number | null> {
  try {
    if (!title) return null;
    const cleanTitle = title.trim();

    // Krok 1: Próba wyszukania z lokalizacją pl-PL
    let url = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=pl-PL&page=1`;
    let res = await fetch(url);
    let json = await res.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].id;
    }

    // Krok 2: Fallback - bez języka
    url = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(cleanTitle)}&page=1`;
    res = await fetch(url);
    json = await res.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].id;
    }

    // Krok 3: Ostateczny Fallback - upraszczamy tytuł serialu
    const simplifiedTitle = cleanTitle.split(':')[0].split('-')[0].trim();
    if (simplifiedTitle !== cleanTitle) {
      console.log(`[TMDB] Upraszczam wyszukiwanie serialu do: ${simplifiedTitle}`);
      url = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(simplifiedTitle)}&page=1`;
      res = await fetch(url);
      json = await res.json();

      if (json.results && json.results.length > 0) {
        return json.results[0].id;
      }
    }

    console.warn(`[TMDB] Całkowity brak wyników w API dla serialu: ${title}`);
    return null;
  } catch (err) {
    console.warn(`getTvIdByTitle failed for title: ${title}`, err);
    return null;
  }
}

export async function getMovieCast(movieId: number, limit = 8): Promise<TMDBPerson[]> {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    return (data.cast || []).slice(0, limit).map((actor: any) => ({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path || null,
    }));
  } catch (err) {
    console.warn(`getMovieCast failed for ID: ${movieId}`, err);
    return [];
  }
}

export async function getTvCast(tvId: number, limit = 8): Promise<TMDBPerson[]> {
  try {
    const url = `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    return (data.cast || []).slice(0, limit).map((actor: any) => ({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path || null,
    }));
  } catch (err) {
    console.warn(`getTvCast failed for ID: ${tvId}`, err);
    return [];
  }
}

/**
 * 🔥 Poprawiony wspólny zaawansowany filtr śmieci z API.
 * Dodaliśmy parametr 'title', aby usuwać bohaterów, których imiona zdradzają tytuł.
 */
const extractValidCharacters = (castArray: any[], title: string = ''): string[] => {
  if (!castArray) return [];
  const tLower = title.toLowerCase().trim();

  return castArray
    .map((actor: any) => ({
      char: actor.character ? actor.character.trim() : '',
      name: actor.name ? actor.name.trim() : '',
    }))
    .filter((item) => {
      const cLower = item.char.toLowerCase();
      const nLower = item.name.toLowerCase();

      if (!item.char || cLower === '' || cLower.includes('uncredited')) return false;
      if (cLower.includes('self') || cLower.includes('himself') || cLower.includes('herself'))
        return false;
      if (cLower.includes('voice') || cLower.includes('głos')) return false;
      if (cLower.includes('extra') || cLower.includes('statysta') || cLower.includes('background'))
        return false;

      // 1. Usuwamy sytuacje, gdzie imię aktora pokrywa się z postacią
      const nameParts: string[] = nLower.split(/\s+/).filter((part: string) => part.length > 2);
      for (const part of nameParts) {
        if (cLower.includes(part)) return false;
      }

      if (cLower.includes(' / ') || cLower.includes(' jako ') || cLower.includes(' as '))
        return false;
      if (cLower.includes('(') || cLower.includes(')')) return false;
      if (item.char.split(',').length > 2) return false;

      // ========================================================
      // 🔥 NOWA WALIDACJA: BLOKOWANIE BOHATERÓW W TYTULE
      // ========================================================
      if (tLower.length > 0) {
        // A. Jeśli cały tytuł zawiera imię bohatera (np. tytuł "Shrek" zawiera "Shrek")
        if (tLower.includes(cLower) || cLower.includes(tLower)) return false;

        // B. Jeśli tytuł jest wieloczłonowy, rozbijamy go na pojedyncze słowa (dłuższe niż 2 znaki)
        const titleParts = tLower.split(/[\s:,\-]+/).filter((part: string) => part.length > 2);
        for (const part of titleParts) {
          if (cLower.includes(part)) {
            console.log(
              `[TMDB VALIDATION] Odrzucono bohatera "${item.char}" dla tytułu "${title}" (częściowe pokrycie: "${part}")`
            );
            return false;
          }
        }
      }
      // ========================================================

      return true;
    })
    .map((item) => item.char);
};

export async function getMovieCharacters(
  movieId: number,
  limit = 5,
  title: string = ''
): Promise<string> {
  try {
    let url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=pl-PL`;
    let res = await fetch(url);
    let data = await res.json();

    let validCharacters = extractValidCharacters(data.cast || [], title);

    if (validCharacters.length === 0) {
      console.log(
        `[TMDB] Brak unikalnych bohaterów PL dla filmu ID ${movieId}. Próba pobrania wersji domyślnej...`
      );
      url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`;
      res = await fetch(url);
      data = await res.json();
      validCharacters = extractValidCharacters(data.cast || [], title);
    }

    // 🔥 UŻYCIE NOWEJ METODY FORMATUJĄCEJ
    return formatListWithBullets(validCharacters, limit) || 'Brak przypisanych bohaterów w API';
  } catch (err) {
    console.warn(`getMovieCharacters failed for ID: ${movieId}`, err);
    return 'Błąd ładowania bohaterów';
  }
}

export async function getTvCharacters(
  tvId: number,
  limit = 5,
  title: string = ''
): Promise<string> {
  try {
    let url = `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${API_KEY}&language=pl-PL`;
    let res = await fetch(url);
    let data = await res.json();

    let validCharacters = extractValidCharacters(data.cast || [], title);

    if (validCharacters.length === 0) {
      console.log(
        `[TMDB] Brak unikalnych bohaterów PL dla serialu ID ${tvId}. Próba pobrania wersji domyślnej...`
      );
      url = `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${API_KEY}`;
      res = await fetch(url);
      data = await res.json();
      validCharacters = extractValidCharacters(data.cast || [], title);
    }

    // 🔥 UŻYCIE NOWEJ METODY FORMATUJĄCEJ
    return formatListWithBullets(validCharacters, limit) || 'Brak przypisanych bohaterów w API';
  } catch (err) {
    console.warn(`getTvCharacters failed for ID: ${tvId}`, err);
    return 'Błąd ładowania bohaterów';
  }
}

export async function getActorPhotoByName(name: string): Promise<string> {
  try {
    const url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`;
    const res = await fetch(url);
    const data = await res.json();

    const personWithPhoto = data.results?.find((p: any) => p.profile_path);
    if (!personWithPhoto) return 'assets/no-image.png';

    return getImageUrl(personWithPhoto.profile_path, 'w500');
  } catch (err) {
    console.warn('getActorPhotoByName failed', err);
    return 'assets/no-image.png';
  }
}

export async function getTopMoviesByDirector(directorName: string, limit = 5): Promise<string> {
  try {
    if (!directorName) return 'Brak przypisanych filmów';
    const cleanName = directorName.trim();

    const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(cleanName)}&language=pl-PL&page=1`;
    const searchRes = await fetch(searchUrl);
    const searchJson = await searchRes.json();

    if (!searchJson.results || searchJson.results.length === 0) {
      console.warn(`[TMDB] Nie odnaleziono reżysera: ${cleanName}`);
      return 'Nie znaleziono reżysera w API';
    }

    const directorId = searchJson.results[0].id;

    const creditsUrl = `https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=${API_KEY}&language=pl-PL`;
    const creditsRes = await fetch(creditsUrl);
    const creditsJson = await creditsRes.json();

    if (!creditsJson.crew || creditsJson.crew.length === 0) {
      return 'Brak filmów reżyserskich w API';
    }

    const directedMovies = creditsJson.crew
      .filter((movie: any) => movie.job && movie.job.toLowerCase() === 'director')
      .filter((movie: any) => movie.title && movie.title.trim() !== '')
      .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));

    if (directedMovies.length === 0) {
      return 'Brak filmów reżyserskich w API';
    }

    const rawTitles = directedMovies.map((m: any) => m.title);

    // 🔥 UŻYCIE NOWEJ METODY FORMATUJĄCEJ
    return formatListWithBullets(rawTitles, limit);
  } catch (err) {
    console.warn(`getTopMoviesByDirector failed for: ${directorName}`, err);
    return 'Błąd ładowania filmów reżysera';
  }
}

function formatListWithBullets(items: string[], limit: number): string {
  const uniqueItems: string[] = [];

  for (const item of items) {
    const cleanItem = item.trim();
    if (cleanItem && !uniqueItems.includes(cleanItem)) {
      uniqueItems.push(cleanItem);
    }
    if (uniqueItems.length === limit) break;
  }

  return uniqueItems.map((item) => `• ${item}`).join('\n');
}
