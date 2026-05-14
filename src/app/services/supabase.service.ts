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
    // Pobieramy pytania z danej kategorii, aby sprawdzić duplikaty
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
    const { data, error } = await this.supabase
    .rpc('get_random_clubs', { sample_size: amount });

    if (error) {
      console.error('Błąd podczas losowania klubów:', error);
      return [];
    }
    return data;
  }

  //buildings

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
      .replace(/[^a-z0-9_]/g, '');

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

}
