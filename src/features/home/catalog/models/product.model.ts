export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category?: string;
    image_url?: string; // Columna de la DB
    image?: string; // Propiedad legacy usada en frontend
    popular?: boolean;
    is_featured?: boolean; // Columna de la DB
  }

  export interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    slug: string;
  }
