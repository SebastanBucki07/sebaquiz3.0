import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public supabase: SupabaseClient = createClient(
    'https://tvawycgprwpjgmeifltx.supabase.co',
    'sb_publishable_W5VsEn1VJYSpMD_i9Sz8Jg_LtH-bxuC'
  );

  public readonly STORAGE_URL =
    'https://tvawycgprwpjgmeifltx.supabase.co/storage/v1/object/public/';

  get auth() {
    return this.supabase.auth;
  }

  async signIn(email: string, pass: string) {
    return await this.supabase.auth.signInWithPassword({ email, password: pass });
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }

  async getCurrentUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }

  authChanges() {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      return session;
    });
  }

  async getQuestionsByCategoryWithAdditional(
    categoryName: string,
    limit: number = 50
  ): Promise<any[]> {
    const nameLower = categoryName.toLowerCase().trim();
    let rawQuestions: any[] = [];

    const isMovieCast =
      nameLower.includes('w jakim filmie zagrała taka obsada') || nameLower === '37';
    const isSeriesCast =
      nameLower.includes('w jakim serialu zagrała taka obsada') || nameLower === '38';

    const isMovieHeroes = nameLower.includes('film po bohaterach') || nameLower === '30';
    const isSeriesHeroes = nameLower.includes('serial po bohaterach') || nameLower === '31';

    // 1. Wywołujemy RPC dla obsady
    if (isMovieCast) {
      const { data, error } = await this.supabase.rpc('get_questions_by_category_id', {
        p_category_id: 37,
      });
      if (error) throw error;
      rawQuestions = data || [];
    } else if (isSeriesCast) {
      const { data, error } = await this.supabase.rpc('get_questions_by_category_id', {
        p_category_id: 38,
      });
      if (error) throw error;
      rawQuestions = data || [];
    }
    // 2. CAŁA RESZTA (w tym kategorie 30 i 31) idzie ze złączeniem tabel
    else {
      // A. Wyciągamy ID kategorii po nazwie
      const { data: foundCategory } = await this.supabase
        .from('categories')
        .select('id')
        .ilike('name', categoryName.trim())
        .single();

      if (!foundCategory) {
        console.warn(`Nie znaleziono kategorii o nazwie: ${categoryName}`);
        return [];
      }

      const targetCategoryId = foundCategory.id;

      // B. KROK 1: Pobieramy ID pytań, gdzie to jest KATEGORIA GŁÓWNA
      const { data: mainCatIds, error: mainError } = await this.supabase
        .from('questions')
        .select('id')
        .eq('category_id', targetCategoryId);

      if (mainError) {
        console.error('Błąd pobierania pytań z kategorii głównej:', mainError);
        return [];
      }

      // C. KROK 2: Pobieramy ID pytań z tabeli łączącej (KATEGORIE DODATKOWE)
      const { data: additionalCatIds, error: addError } = await this.supabase
        .from('question_additional_categories')
        .select('question_id')
        .eq('category_id', targetCategoryId);

      if (addError) {
        console.error('Błąd pobierania pytań z kategorii dodatkowych:', addError);
        return [];
      }

      // D. Łączymy obie listy ID i wyciągamy tylko unikalne wartości
      const mainIds = mainCatIds?.map((q) => q.id) || [];
      const addIds =
        additionalCatIds?.map((q) => q.question_id).filter((id): id is bigint => id !== null) || [];

      const allUniqueIds = Array.from(new Set([...mainIds, ...addIds]));

      if (allUniqueIds.length === 0) {
        console.log(
          `Brak pytań przypisanych do kategorii: "${categoryName}" (ID: ${targetCategoryId})`
        );
        return [];
      }

      // E. Losujemy i tniemy do limitu (50)
      const shuffledIds = allUniqueIds.sort(() => Math.random() - 0.5).slice(0, limit);

      // F. Pobieramy pełne rekordy pytań dla wylosowanych ID
      const { data, error } = await this.supabase
        .from('questions')
        .select('*')
        .in('id', shuffledIds);

      if (error) {
        console.error('Błąd pobierania pełnych danych pytań:', error);
        return [];
      }
      rawQuestions = data || [];
    }

    // 3. Mapowanie struktury (Zostaje bez zmian, pilnuje poprawnych tekstów pytań)
    return rawQuestions.map((q: any) => {
      const finalAnswers = q.answers || q.answers_json || q.data?.answers || [];
      const catId = q.category_id || q.data?.category_id;

      const originalQuestion = q.question || '';
      let questionText = originalQuestion;

      if (catId === 37 || catId === '37' || isMovieCast) {
        questionText = 'W jakim filmie zagrała taka obsada?';
      } else if (catId === 38 || catId === '38' || isSeriesCast) {
        questionText = 'W jakim serialu zagrała taka obsada?';
      } else if (catId === 30 || catId === '30' || isMovieHeroes) {
        questionText = originalQuestion.toLowerCase().includes('film po bohaterach')
          ? originalQuestion
          : `Rozpoznaj film po bohaterach:\n${originalQuestion}`;
      } else if (catId === 31 || catId === '31' || isSeriesHeroes) {
        questionText = originalQuestion.toLowerCase().includes('serial po bohaterach')
          ? originalQuestion
          : `Rozpoznaj serial po bohaterach:\n${originalQuestion}`;
      }

      return {
        ...q,
        question: questionText,
        answers: Array.isArray(finalAnswers) ? finalAnswers : JSON.parse(finalAnswers || '[]'),
        revealedAnswers: q.revealed_answers || q.revealedAnswers || [],
      };
    });
  }

  async getCategoryTypes() {
    const { data, error } = await this.supabase
      .from('category_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Błąd pobierania typów kategorii:', error);
      throw error;
    }
    return data || [];
  }

  async addCategory(categoryData: any) {
    const { data, error } = await this.supabase
      .from('categories')
      .insert([
        {
          name: categoryData.name,
          type_id: categoryData.type_id,
          color: categoryData.color,
          base_points: categoryData.base_points,
          is_active: categoryData.is_active,
          icon: categoryData.icon,
          timer_seconds: categoryData.timer_seconds,
        },
      ])
      .select();

    if (error) {
      console.error('Błąd podczas dodawania kategorii:', error);
      throw error;
    }
    return data;
  }

  async getCategories() {
    const { data, error } = await this.supabase
      .from('categories')
      .select(
        `
        *,
        timer_seconds,
        category_types (
          id,
          name,
          label
        )
      `
      )
      .order('name', { ascending: true });

    if (error) console.error('Błąd pobierania kategorii:', error);
    return data || [];
  }

  async getCategoriesByType(typeId: number) {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*, timer_seconds')
      .eq('type_id', typeId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Błąd pobierania kategorii po typie:', error);
      throw error;
    }
    return data || [];
  }

  async getQuestions(categoryName: string, limit: number = 50) {
    const { data: allIds } = await this.supabase
      .from('questions')
      .select('id, categories!inner(name)')
      .ilike('categories.name', categoryName.trim());

    if (!allIds || allIds.length === 0) return [];

    const shuffledIds = allIds
      .map((item) => item.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    const { data, error } = await this.supabase.from('questions').select('*').in('id', shuffledIds);

    if (error) {
      console.error('Błąd pobierania pytań:', error);
      return [];
    }

    return (data || []).map((q) => {
      const finalAnswers = q.answers || q.answers_json || q.data?.answers || [];
      return {
        ...q,
        answers: Array.isArray(finalAnswers) ? finalAnswers : JSON.parse(finalAnswers || '[]'),
        revealedAnswers: q.revealed_answers || q.revealedAnswers || [],
      };
    });
  }

  async getQuestionById(id: number) {
    const { data, error } = await this.supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return { data, error };
  }

  async getQuestionsList(limit: number = 100, categoryId?: number, search?: string) {
    let query = this.supabase
      .from('questions')
      .select(
        `
        *,
        author:profiles!created_by(username),
        editor:profiles!updated_by(username)
      `
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (search && search.trim() !== '') {
      query = query.or(`question.ilike.%${search}%, answers->0->>value.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) console.error('Błąd getQuestionsList:', error);
    return { data, error };
  }

  async addQuestion(payload: any) {
    const { data, error } = await this.supabase
      .from('questions')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateQuestion(id: number, questionData: any) {
    const { error } = await this.supabase
      .from('questions')
      .update({
        category_id: questionData.category_id,
        question: questionData.question,
        answers: questionData.answers,
        hints: questionData.hints,
      })
      .eq('id', id);

    return { error };
  }

  /* --- NARZĘDZIA --- */

  async getClubs() {
    return await this.supabase.from('clubs').select('*').order('name', { ascending: true });
  }

  getPublicUrl(path: string): string {
    if (!path || path.includes('no-image.png')) {
      return '/no-image.png';
    }

    const fileName = path.split('/').pop();

    return `${this.STORAGE_URL}footballCrestes/${fileName}`.replace(/([^:]\/)\/+/g, '$1');
  }

  async uploadCrest(file: File, clubName: string): Promise<string> {
    const cleanName = clubName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    const fileExt = file.name.split('.').pop();
    const fileName = `${cleanName}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await this.supabase.storage
      .from('footballCrestes')
      .upload(fileName, file, { upsert: false });

    if (error) {
      if (error.message.includes('already exists')) {
        throw new Error('Klub o takiej nazwie ma już swój herb w bazie!');
      }
      throw error;
    }
    return filePath;
  }

  async addNewClub(name: string, fileName: string) {
    return await this.supabase.from('clubs').insert([{ name: name, file_name: fileName }]);
  }

  async checkDuplicate(
    questionText: string,
    categoryId: number,
    answers?: any[]
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('questions')
      .select('question, answers')
      .eq('category_id', categoryId);

    if (error || !data) return false;

    const newName = answers?.[0]?.value?.toLowerCase().trim() || '';
    if (!newName) return false;

    return data.some((record) => {
      let existingAnswers = record.answers;

      if (typeof existingAnswers === 'string') {
        try {
          existingAnswers = JSON.parse(existingAnswers);
        } catch {
          existingAnswers = [];
        }
      }

      const existingName = Array.isArray(existingAnswers)
        ? existingAnswers[0]?.value
        : (existingAnswers as any)?.value || '';

      return existingName.toLowerCase().trim() === newName;
    });
  }

  async getRandomClubs(amount: number = 50) {
    const { data, error } = await this.supabase.rpc('get_random_clubs', { sample_size: amount });

    if (error) {
      console.error('Błąd podczas losowania klubów:', error);
      return [];
    }
    return data;
  }

  async uploadBuilding(file: File, buildingName: string): Promise<string> {
    const fileExt = file.name.split('.').pop();

    const cleanName = buildingName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-z0-9_]/g, '');

    const fileName = `${cleanName}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await this.supabase.storage
      .from('buildings')
      .upload(filePath, file, { upsert: true });

    if (error) throw error;
    return fileName;
  }

  async addNewBuilding(name: string, fileName: string) {
    return await this.supabase.from('buildings').insert([{ name, file_name: fileName }]);
  }

  async getBuildings() {
    return await this.supabase.from('buildings').select('*').order('name', { ascending: true });
  }

  async uploadPhoto(file: File, itemName: string, bucketName: string): Promise<string> {
    const fileExt = file.name.split('.').pop();

    const cleanName = itemName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, ''); // <--- POPRAWIONE na `a-z`

    const fileName = `${cleanName}_${Date.now()}.${fileExt}`;

    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    return fileName;
  }

  getPublicUrlFromBucket(bucket: string, fileName: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  async insertToBuildings(data: any) {
    const { error } = await this.supabase.from('buildings').insert([data]);

    if (error) throw error;
  }

  /* --- GEOGRAFIA (COUNTRIES) --- */

  async getCountries() {
    const { data, error } = await this.supabase
      .from('countries')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Błąd pobierania państw z Supabase:', error);
      throw error;
    }
    return data || [];
  }

  async addCountry(countryData: {
    name: string;
    capital: string;
    continent: string;
    file_name?: string;
  }) {
    const { data, error } = await this.supabase
      .from('countries')
      .insert([countryData])
      .select()
      .single();

    if (error) {
      console.error('Błąd podczas dodawania państwa:', error);
      throw error;
    }
    return data;
  }

  async updateCountry(
    id: number,
    countryData: { name: string; capital: string; continent: string; file_name?: string }
  ) {
    const { data, error } = await this.supabase
      .from('countries')
      .update(countryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Błąd aktualizacji państwa o ID ${id}:`, error);
      throw error;
    }
    return data;
  }

  async getRandomCountries(amount: number = 50) {
    const { data, error } = await this.supabase.rpc('get_random_countries', {
      sample_size: amount,
    });

    if (error) {
      console.warn(
        'Błąd RPC get_random_countries, pobieram standardowo i losuję na frontendzie...',
        error
      );
      const allCountries = await this.getCountries();
      return allCountries.sort(() => Math.random() - 0.5).slice(0, amount);
    }
    return data;
  }
}
