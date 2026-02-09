import { environment } from "../../../environments/environment.prod"

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

interface TMDBPersonResponse {
  results: TMDBPerson[];
}

export function getImageUrl(filePath: string | null, size = 'w500'): string {
  if (!filePath) return 'assets/no-image.png'; // placeholder
  const baseUrl = 'https://image.tmdb.org/t/p/';
  return `${baseUrl}${size}${filePath}`;
}

export async function getMovieIdByTitle(title: string): Promise<number> {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    title
  )}&language=pl-PL&page=1`

  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${environment.apiToken}`,
    },
  })

  const json = await res.json()
  return json.results[0]?.id
}

export async function getTvIdByTitle(title: string): Promise<number> {
  const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
    title
  )}&language=pl-PL&page=1`;

  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${environment.apiToken}`,
    },
  });

  const json = await res.json();
  return json.results[0]?.id;
}


export async function getMovieCast(movieId: number, limit = 8): Promise<TMDBPerson[]> {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${environment.apiToken}`,
    },
  });
  const data = await res.json();

  return (data.cast || [])
    .slice(0, limit)
    .map((actor: any) => ({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path || null
    }));
}

export async function getTvCast(tvId: number, limit = 8): Promise<TMDBPerson[]> {
  const url = `https://api.themoviedb.org/3/tv/${tvId}/credits`;

  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${environment.apiToken}`,
    },
  });

  const data = await res.json();

  return (data.cast || [])
    .slice(0, limit)
    .map((actor: any) => ({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path || null
    }));
}

export async function getActorPhotoByName(
  name: string,
  size: 'w185' | 'w342' | 'w500' | 'original' = 'w500'
): Promise<string> {

  const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(name)}`;

  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${environment.apiToken}`,
    },
  });

  if (!res.ok) {
    return getImageUrl(null, size);
  }

  const data: TMDBPersonResponse = await res.json();

  if (!data.results?.length) {
    return getImageUrl(null, size);
  }

  // Preferuj aktorów
  const person =
    data.results.find(p => p.known_for_department === 'Acting')
    ?? data.results[0];

  return getImageUrl(person.profile_path, size);
}







