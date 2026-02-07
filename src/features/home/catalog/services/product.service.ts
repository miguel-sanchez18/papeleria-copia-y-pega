import { Product } from '../models/product.model';

export const products: Product[] = [
  {
    id: '1',
    name: 'Hojas Blancas (Paquete)',
    description: 'Paquete de 500 hojas bond tamaño carta, ideal para impresiones.',
    price: 120,
    category: 'Oficina',
    popular: true,
  },
  {
    id: '2',
    name: 'Libreta Profesional',
    description: 'Cuaderno de raya o cuadro, pasta dura resistente.',
    price: 85,
    category: 'Escolar',
    popular: true,
  },
  {
    id: '3',
    name: 'Impresión B/N',
    description: 'Impresión láser de alta calidad en blanco y negro.',
    price: 2,
    category: 'Servicio',
    popular: true,
  },
  {
    id: '4',
    name: 'Juego de Geometría',
    description: 'Incluye regla, escuadras, transportador y compás.',
    price: 45,
    category: 'Escolar',
  },
  {
    id: '5',
    name: 'Engargolado',
    description: 'Pasta transparente y arillo metálico o plástico.',
    price: 35,
    category: 'Servicio',
  },
  {
    id: '6',
    name: 'Plumas (Caja)',
    description: 'Caja con 12 bolígrafos de punto mediano.',
    price: 60,
    category: 'Oficina',
  },
];
