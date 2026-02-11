import { Product } from '../models/product.model';

export const ProductService = {
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products?featured=true');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Error fetching all products:", error);
      return [];
    }
  },

  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
};

// Deprecated: Hardcoded data kept for reference but should not be used
export const products: Product[] = [];
