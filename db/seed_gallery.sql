-- Add more products to ensure at least 4 per category

-- Category 5: Copias e impresiones
INSERT INTO products (name, description, price, category_id, stock_status) VALUES
('Reducción de Planos', 'Reducción de planos arquitectónicos a tamaño carta o doble carta.', 15.00, 5, 'in_stock'),
('Engargolado Espiral', 'Engargolado con espiral de plástico, incluye pasta transparente y negra.', 25.00, 5, 'in_stock'),
('Enmicado Carta', 'Protección rígida para documentos importantes tamaño carta.', 10.00, 5, 'in_stock'),
('Impresión Fotográfica', 'Impresión en papel fotográfico brillante de alta calidad 4x6.', 8.00, 5, 'in_stock');

-- Category 2: Útiles Escolares
INSERT INTO products (name, description, price, category_id, stock_status) VALUES
('Pegamento en Barra', 'Pegamento sólido no tóxico, lavable, 20g.', 12.00, 2, 'in_stock'),
('Tijeras Escolares', 'Tijeras de punta roma para seguridad, acero inoxidable.', 18.00, 2, 'in_stock'),
('Compás de Precisión', 'Compás metálico con adaptador para lápiz.', 35.00, 2, 'in_stock'),
('Colores Pastel (24pz)', 'Caja de 24 colores de madera, mina resistente.', 110.00, 2, 'in_stock');

-- Category 7: Material de oficina
INSERT INTO products (name, description, price, category_id, stock_status) VALUES
('Calculadora Básica', 'Calculadora de bolsillo con funciones estándar y pantalla solar.', 65.00, 7, 'in_stock'),
('Grapadora Estándar', 'Grapadora metálica de media tira, usa grapas estándar 26/6.', 120.00, 7, 'in_stock'),
('Hojas de Seguridad', 'Papel seguridad para impresiones oficiales, marca de agua.', 2.00, 7, 'in_stock'),
('Post-it Notas Adhesivas', 'Bloque de notas adhesivas amarillas 3x3 pulgadas.', 25.00, 7, 'in_stock');
