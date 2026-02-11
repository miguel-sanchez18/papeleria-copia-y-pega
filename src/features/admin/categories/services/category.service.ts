import { fetchWithAuth } from '../../../../utils/api';
import { Category } from '../models/category.model';

const API_URL = '/api/admin/categories';

export const CategoryService = {
  getAll: async (token: string): Promise<Category[]> => {
    const res = await fetchWithAuth(API_URL);
    if (!res.ok) throw new Error('Error fetching categories');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  create: async (token: string, category: Partial<Category>): Promise<Category> => {
    const res = await fetchWithAuth(API_URL, {
      method: 'POST',
      body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Error creating category');
    return res.json();
  },

  update: async (token: string, id: number, category: Partial<Category>): Promise<Category> => {
    const res = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error('Error updating category');
    return res.json();
  },

  delete: async (token: string, id: number): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error deleting category');
  }
};
