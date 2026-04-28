import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase = createClient(
    'https://tvawycgprwpjgmeifltx.supabase.co',
    'sb_publishable_W5VsEn1VJYSpMD_i9Sz8Jg_LtH-bxuC'
  );

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

    const { data, error } = await this.supabase
    .from('questions')
    .select('*') // Pobieramy absolutnie wszystko
    .in('id', shuffledIds);

    console.log('--- DEBUG SUPABASE ---');
    console.log('Surowe dane z bazy:', data); // ZOBACZ TO W KONSOLI (F12)

    if (error) {
      console.error('Błąd:', error);
      return [];
    }

    return (data || []).map((q) => {
      const finalAnswers = q.answers || q.answers_json || q.data?.answers || [];

      return {
        ...q,
        question: q.question,
        answers: Array.isArray(finalAnswers) ? finalAnswers : JSON.parse(finalAnswers || '[]'),
        revealedAnswers: q.revealedAnswers || q.revealed_answers || [],
      };
    });
  }

  async addQuestion(questionData: any) {
    const { data, error } = await this.supabase.from('questions').insert([questionData]);

    return { data, error };
  }

  async getCategoriesByType(typeId: number) {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('type_id', typeId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Błąd pobierania kategorii po typie:', error);
      throw error;
    }
    return data || [];
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

    if (answers && answers.length > 0) {
      const createFingerprint = (ans: any[]) =>
        ans
          .map((a) => `${a.label.toLowerCase()}:${a.value.toLowerCase().trim()}`)
          .sort()
          .join('|');

      const newFingerprint = createFingerprint(answers);
      return data.some((record) => createFingerprint(record.answers || []) === newFingerprint);
    }

    const normalizedNewQuestion = questionText.toLowerCase().trim();
    return data.some((record) => record.question.toLowerCase().trim() === normalizedNewQuestion);
  }
}
