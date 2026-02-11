-- ==========================================
-- 1. Tabla de Categorías
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50), 
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. Tabla de Productos
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 0.00,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE, -- Para "Lo más buscado"
    stock_status VARCHAR(20) DEFAULT 'in_stock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. Tabla de Galería (Imágenes adicionales)
-- ==========================================
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(200),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. Datos de Prueba (Seed Data)
-- ==========================================

-- Categorías
INSERT INTO categories (name, slug, icon, description) VALUES
('Copias e impresiones', 'copias-e-impresiones', '🖨️', 'Servicios de impresión láser, copias y escaneos.'),
('Útiles escolares', 'utiles-escolares', '✏️', 'Material escolar para todos los niveles.'),
('Material de oficina', 'material-de-oficina', '📎', 'Insumos para oficina y papelería técnica.'),
('Regalos y Detalles', 'regalos', '🎁', 'Bolsas, envolturas y detalles.');

-- Productos (Mezcla de destacados y normales)
INSERT INTO products (category_id, name, description, price, is_featured, image_url) VALUES
-- Destacados (Lo más buscado)
(1, 'Impresión Color Tabloide', 'Papel couché de 300g, ideal para pósters.', 15.00, TRUE, '/assets/products/tabloide.jpg'),
(1, 'Copia Blanco y Negro', 'Papel bond de alta blancura.', 1.00, TRUE, '/assets/products/copia_bn.jpg'),
(2, 'Libreta Norma Profesional', 'Cuadro grande, 100 hojas, varios colores.', 45.00, TRUE, '/assets/products/libreta.jpg'),
(2, 'Juego Geometría Maped', 'Juego completo flexible e irrompible.', 65.00, TRUE, '/assets/products/geo.jpg'),

-- Otros Productos (Para rellenar galería/catálogo)
(3, 'Paquete Hojas Blancas', '500 hojas tamaño carta.', 110.00, FALSE, NULL),
(3, 'Grapadora Mae', 'Metálica, uso rudo, incluye grapas.', 85.00, FALSE, NULL),
(2, 'Colores Prismacolor Jr', 'Caja con 12 colores largos.', 95.00, FALSE, NULL),
(1, 'Escaneo a PDF', 'Digitalización de documentos a USB o correo.', 10.00, FALSE, NULL);

-- Imágenes de Galería (Solo visuales)
INSERT INTO gallery_images (category_id, title, image_url) VALUES
(1, 'Tesis Empastada', 'https://placehold.co/600x400?text=Tesis'),
(1, 'Engargolado Espiral', 'https://placehold.co/600x400?text=Engargolado'),
(2, 'Mochila Chenson', 'https://placehold.co/600x400?text=Mochila');

-- ==========================================
-- 5. Tabla de Usuarios
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin', -- 'master' | 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Master User (Password: admin123)
-- Hash generated with bcryptjs
INSERT INTO users (username, password_hash, role) VALUES
('master', '$2a$10$X7V.j5T.t.K.j.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X.X', 'master')
ON CONFLICT (username) DO NOTHING;
