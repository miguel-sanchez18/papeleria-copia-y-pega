-- 1. Crear Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    stock_status VARCHAR(20) DEFAULT 'in_stock',
    stock_quantity INTEGER DEFAULT 0,
    track_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear Tabla de Usuarios (Admin/Master)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin', -- 'admin' or 'master'
    full_name VARCHAR(100),
    email VARCHAR(100),
    profile_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Crear Tabla de Ventas
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Crear Tabla de Items de Venta
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- 6. Crear Tabla de Galería (Imágenes Visuales)
CREATE TABLE IF NOT EXISTS gallery_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(200),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Insertar Datos de Ejemplo (Seed Data)

-- Categorías
INSERT INTO categories (name, slug, icon, description) VALUES
('Impresiones y Copias', 'impresiones', '🖨️', 'Servicios de impresión láser, copias y escaneos'),
('Útiles Escolares', 'utiles-escolares', '✏️', 'Todo para el regreso a clases'),
('Material de Oficina', 'material-oficina', '📎', 'Insumos para tu negocio'),
('Regalos y Detalles', 'regalos', '🎁', 'Bolsas y envolturas')
ON CONFLICT (slug) DO NOTHING;

-- Productos (Ejemplos)
INSERT INTO products (category_id, name, description, price, is_featured, stock_quantity, track_stock) 
SELECT id, 'Impresión Color Tabloide', 'Papel couché de 300g alta resolución.', 15.00, TRUE, 0, FALSE
FROM categories WHERE slug = 'impresiones'
LIMIT 1;

INSERT INTO products (category_id, name, description, price, is_featured, stock_quantity, track_stock) 
SELECT id, 'Libreta Profesional', 'Cuadro grande, 100 hojas.', 45.00, TRUE, 50, TRUE
FROM categories WHERE slug = 'utiles-escolares'
LIMIT 1;

-- Galería
INSERT INTO gallery_items (category_id, title, image_url)
SELECT id, 'Trabajo de Tesis', 'https://placehold.co/600x400'
FROM categories WHERE slug = 'impresiones'
LIMIT 1;
