-- Fix featured products
-- Set specific products as featured

UPDATE products 
SET is_featured = TRUE 
WHERE name IN (
    'Libreta Profesional', 
    'Hojas Blancas (Paquete)', 
    'Impresión B/N', 
    'Impresión Color Tabloide',
    'Juego de Geometría'
);
