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

  async getQuestions(categoryName: string) {
    const { data, error } = await this.supabase
      .from('questions')
      .select(
        `
      *,
      categories!inner (
        name
      )
    `
      )

      .ilike('categories.name', categoryName.trim());

    if (error) {
      console.error('Błąd pobierania pytań z relacją:', error.message);
      throw error;
    }

    return (data || []).map((q) => ({
      ...q,
      category: q.categories?.name,
    }));
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

  async checkDuplicate(questionText: string, categoryId: number): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('questions')
      .select('id')
      .eq('category_id', categoryId)
      .ilike('question', questionText.trim())
      .maybeSingle();

    if (error) {
      console.error('Error checking duplicates:', error);
      return false;
    }

    return !!data;
  }
}
