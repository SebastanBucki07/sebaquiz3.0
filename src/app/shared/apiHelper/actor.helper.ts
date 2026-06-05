import { environment } from '../../../environments/environment.prod';
import { TMDBPerson } from '../models/TMDB/tmdbPerson.interface';

export function getImageUrl(filePath: string | null, size = 'w500'): string {
  if (!filePath) return 'assets/no-image.png'; // placeholder
  const baseUrl = 'https://image.tmdb.org/t/p/';
  return `${baseUrl}${size}${filePath}`;
}

export async function getMovieIdByTitle(title: string): Promise<number | null> {
  try {
    if (!title) return null;
    const cleanTitle = title.trim();

    // Krok 1: Próba wyszukania z lokalizacją pl-PL
    let url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(cleanTitle)}&language=pl-PL&page=1`;
    let res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
    let json = await res.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].id;
    }

    // Krok 2: Fallback - jeśli nie znalazło, próbujemy ogólnie bez języka
    url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(cleanTitle)}&page=1`;
    res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
    json = await res.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].id;
    }

    // Krok 3: Ostateczny Fallback - upraszczamy tytuł (usuwamy podtytuły po dwukropkach, myślnikach)
    // Przydatne dla tytułów typu "Matrix: Reaktywacja" -> szuka samo "Matrix"
    const simplifiedTitle = cleanTitle.split(':')[0].split('-')[0].trim();
    if (simplifiedTitle !== cleanTitle) {
      console.log(`[TMDB] Upraszczam wyszukiwanie filmu do: ${simplifiedTitle}`);
      url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(simplifiedTitle)}&page=1`;
      res = await fetch(url, {
        headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
      });
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
    let url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(cleanTitle)}&language=pl-PL&page=1`;
    let res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
    let json = await res.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].id;
    }

    // Krok 2: Fallback - bez języka
    url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(cleanTitle)}&page=1`;
    res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
    json = await res.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].id;
    }

    // Krok 3: Ostateczny Fallback - upraszczamy tytuł serialu
    const simplifiedTitle = cleanTitle.split(':')[0].split('-')[0].trim();
    if (simplifiedTitle !== cleanTitle) {
      console.log(`[TMDB] Upraszczam wyszukiwanie serialu do: ${simplifiedTitle}`);
      url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(simplifiedTitle)}&page=1`;
      res = await fetch(url, {
        headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
      });
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
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
    const res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
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
    const url = `https://api.themoviedb.org/3/tv/${tvId}/credits`;
    const res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
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

export async function getMovieCharacters(movieId: number, limit = 5): Promise<string> {
  try {
    // 1. Najpierw pytamy wersję polską
    let url = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=pl-PL`;
    let res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
    let data = await res.json();

    // Funkcja pomocnicza do czyszczenia i filtrowania obsady
    const extractValidCharacters = (castArray: any[]): string[] => {
      if (!castArray) return [];
      return castArray
        .map((actor: any) => ({
          char: actor.character ? actor.character.trim() : '',
          name: actor.name ? actor.name.trim() : '',
        }))
        .filter((item) => {
          const cLower = item.char.toLowerCase();
          // Eliminujemy puste pola i oczywiste śmieci z API
          if (!item.char || cLower === '' || cLower.includes('uncredited')) return false;
          if (cLower.includes('self') || cLower.includes('himself') || cLower.includes('herself'))
            return false;
          if (cLower.includes('voice') || cLower.includes('głos')) return false;
          // Jeśli imię bohatera jest takie samo jak nazwisko aktora, to błąd w TMDB - odrzucamy
          if (item.char === item.name) return false;
          return true;
        })
        .map((item) => item.char);
    };

    // Pobieramy szeroką pulę (20-25 osób), żeby mieć z czego filtrować prawdziwych bohaterów
    let validCharacters = extractValidCharacters(data.cast || []);

    // 2. Fallback: Jeśli polska wersja dała pustkę, natychmiast uderzamy po wersję domyślną (EN)
    if (validCharacters.length === 0) {
      console.log(
        `[TMDB] Brak unikalnych bohaterów PL dla filmu ID ${movieId}. Próba pobrania wersji domyślnej...`
      );
      url = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
      res = await fetch(url, {
        headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
      });
      data = await res.json();
      validCharacters = extractValidCharacters(data.cast || []);
    }

    // Zwracamy maksymalnie tyle unikalnych bohaterów, o ile prosił komponent (domyślnie 5)
    const finalResult = validCharacters.slice(0, limit).join(', ');
    return finalResult || 'Brak przypisanych bohaterów w API';
  } catch (err) {
    console.warn(`getMovieCharacters failed for ID: ${movieId}`, err);
    return 'Błąd ładowania bohaterów';
  }
}

export async function getTvCharacters(tvId: number, limit = 5): Promise<string> {
  try {
    // 1. Najpierw pytamy wersję polską
    let url = `https://api.themoviedb.org/3/tv/${tvId}/credits?language=pl-PL`;
    let res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
    let data = await res.json();

    const extractValidCharacters = (castArray: any[]): string[] => {
      if (!castArray) return [];
      return castArray
        .map((actor: any) => ({
          char: actor.character ? actor.character.trim() : '',
          name: actor.name ? actor.name.trim() : '',
        }))
        .filter((item) => {
          const cLower = item.char.toLowerCase();
          if (!item.char || cLower === '' || cLower.includes('uncredited')) return false;
          if (cLower.includes('self') || cLower.includes('himself') || cLower.includes('herself'))
            return false;
          if (cLower.includes('voice') || cLower.includes('głos')) return false;
          if (item.char === item.name) return false;
          return true;
        })
        .map((item) => item.char);
    };

    let validCharacters = extractValidCharacters(data.cast || []);

    // 2. Fallback: Jeśli puste, wersja domyślna
    if (validCharacters.length === 0) {
      console.log(
        `[TMDB] Brak unikalnych bohaterów PL dla serialu ID ${tvId}. Próba pobrania wersji domyślnej...`
      );
      url = `https://api.themoviedb.org/3/tv/${tvId}/credits`;
      res = await fetch(url, {
        headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
      });
      data = await res.json();
      validCharacters = extractValidCharacters(data.cast || []);
    }

    const finalResult = validCharacters.slice(0, limit).join(', ');
    return finalResult || 'Brak przypisanych bohaterów w API';
  } catch (err) {
    console.warn(`getTvCharacters failed for ID: ${tvId}`, err);
    return 'Błąd ładowania bohaterów';
  }
}

export async function getActorPhotoByName(name: string): Promise<string> {
  try {
    const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${environment.apiToken}` },
    });
    const data = await res.json();

    const personWithPhoto = data.results?.find((p: any) => p.profile_path);
    if (!personWithPhoto) return 'assets/no-image.png';

    return getImageUrl(personWithPhoto.profile_path, 'w500');
  } catch (err) {
    console.warn('getActorPhotoByName failed', err);
    return 'assets/no-image.png';
  }
}
