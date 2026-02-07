export interface GalleryItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface GalleryCategory {
  id: string;
  title: string;
  items: GalleryItem[];
}

export const galleryData: Record<string, GalleryItem[]> = {
  "Copias e impresiones": [
    { id: "g1", name: "Impresión B/N Carta", price: 2.00 },
    { id: "g2", name: "Impresión Color Carta", price: 5.00 },
    { id: "g3", name: "Copia B/N Oficio", price: 2.50 },
    { id: "g4", name: "Impresión Tabloide", price: 15.00 },
    { id: "g5", name: "Escaneo a PDF", price: 10.00 },
  ],
  "Útiles escolares": [
    { id: "g6", name: "Libreta Profesional Raya", price: 85.00 },
    { id: "g7", name: "Lápiz Mirado #2", price: 8.00 },
    { id: "g8", name: "Juego de Geometría", price: 45.00 },
    { id: "g9", name: "Colores de Madera (12pz)", price: 90.00 },
    { id: "g10", name: "Borrador de Migajón", price: 12.00 },
    { id: "g11", name: "Sacapuntas con depósito", price: 15.00 },
  ],
  "Material de oficina": [
    { id: "g12", name: "Carpeta de Argollas", price: 65.00 },
    { id: "g13", name: "Sobre Amarillo Carta", price: 3.00 },
    { id: "g14", name: "Plumas (Caja 12pz)", price: 60.00 },
    { id: "g15", name: "Marcatextos (Juego 4pz)", price: 40.00 },
    { id: "g16", name: "Clips (Caja pequeña)", price: 15.00 },
  ]
};
