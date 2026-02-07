export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Escolar' | 'Oficina' | 'Servicio' | 'Otro';
  image?: string; // URL de la imagen (opcional por ahora)
  popular?: boolean; // Para destacar en la home si es necesario
}
