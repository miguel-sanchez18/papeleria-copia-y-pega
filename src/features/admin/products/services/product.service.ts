import { fetchWithAuth } from '../../../../utils/api';
import { Product } from '../models/product.model';

const API_URL = '/api/admin/products';

export const ProductService = {
  getAll: async (token: string): Promise<Product[]> => {
    const res = await fetchWithAuth(API_URL);
    if (!res.ok) throw new Error("Error fetching products");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },
  
  create: async (token: string, product: any): Promise<Product> => {
     const isFormData = product instanceof FormData;
     const res = await fetchWithAuth(API_URL, {
         method: 'POST',
         body: isFormData ? product : JSON.stringify(product)
     });
     if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || "Error creating product");
     }
     return res.json();
  },

  update: async (token: string, id: number, product: any): Promise<Product> => {
      const isFormData = product instanceof FormData;
      const res = await fetchWithAuth(`${API_URL}/${id}`, {
          method: 'PUT',
          body: isFormData ? product : JSON.stringify(product)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error updating product");
      }
      return res.json();
  },

  delete: async (token: string, id: number): Promise<void> => {
      const res = await fetchWithAuth(`${API_URL}/${id}`, {
          method: 'DELETE'
      });
      if (!res.ok) throw new Error("Error deleting product");
  }
};
