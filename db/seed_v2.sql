-- ==========================================
-- SCRIPT DE RESTAURACIÓN DE DATOS (seed_v2.sql)
-- ==========================================

-- 1. Limpiar datos existentes (Opcional, quitar los comentarios si se quiere borrar todo antes)
-- TRUNCATE TABLE products, gallery_images, categories RESTART IDENTITY CASCADE;

-- 2. Insertar Categorías (Si no existen)
-- Usamos ON CONFLICT para no duplicar si ya existen
INSERT INTO categories (name, slug, icon, description) VALUES
('Copias e impresiones', 'copias-e-impresiones', '🖨️', 'Servicios de impresión láser, copias y escaneos.'),
('Útiles escolares', 'utiles-escolares', '✏️', 'Material escolar para todos los niveles.'),
('Material de oficina', 'material-de-oficina', '📁', 'Insumos para oficina y papelería técnica.'),
('Regalos y Detalles', 'regalos', '🎁', 'Bolsas, envolturas y detalles.')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insertar Productos "Lo más buscado"
-- Asumimos los IDs de categorías basados en el orden de inserción:
-- 1: Copias e impresiones
-- 2: Útiles escolares
-- 3: Material de oficina
-- 4: Regalos

INSERT INTO products (name, description, price, category_id, is_featured, stock_status) VALUES
-- Oficina (ID 3)
('Hojas Blancas (Paquete)', 'Paquete de 500 hojas bond tamaño carta, ideal para impresiones.', 120.00, 3, TRUE, 'in_stock'),
-- Escolar (ID 2)
('Libreta Profesional', 'Cuaderno de raya o cuadro, pasta dura resistente.', 85.00, 2, TRUE, 'in_stock'),
-- Servicio -> Copias e impresiones (ID 1)
('Impresión B/N', 'Impresión láser de alta calidad en blanco y negro.', 2.00, 1, TRUE, 'in_stock'),
-- Escolar (ID 2)
('Juego de Geometría', 'Incluye regla, escuadras, transportador y compás.', 45.00, 2, TRUE, 'in_stock'),

-- Otros productos del catálogo original
('Engargolado', 'Pasta transparente y arillo metálico o plástico.', 35.00, 1, FALSE, 'in_stock'),
('Plumas (Caja)', 'Caja con 12 bolígrafos de punto mediano.', 60.00, 3, FALSE, 'in_stock');
