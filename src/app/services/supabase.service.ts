import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase = createClient(
    'https://tvawycgprwpjgmeifltx.supabase.co',
    'sb_publishable_W5VsEn1VJYSpMD_i9Sz8Jg_LtH-bxuC'
  );

  // 1. Pobiera wszystkie typy kategorii (słownik)
  async getCategoryTypes() {
    const { data, error } = await this.supabase
      .from('category_types')
      .select('*')
      .order('label', { ascending: true }); // Opcjonalne sortowanie alfabetyczne

    if (error) console.error('Błąd pobierania typów:', error);
    return data || [];
  }

  // 2. Pobiera wszystkie kategorie wraz z danymi ich typu
  async getCategories() {
    const { data, error } = await this.supabase
      .from('categories')
      .select(
        `
        *,
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

  async getQuestions(category: string) {
    const { data } = await this.supabase.from('questions').select('*').eq('category', category);

    return data || [];
  }

  async addQuestion(questionData: any) {
    const { data, error } = await this.supabase.from('questions').insert([
      {
        category: questionData.category,
        question: questionData.question,
        answers: questionData.answers,
        hints: questionData.hints,
      },
    ]);
    return { data, error };
  }
}
