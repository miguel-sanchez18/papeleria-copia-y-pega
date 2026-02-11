-- CLEANUP SCRIPT
-- Consolidate duplicate categories

-- 1. Move products from "Impresiones y Copias" (ID 1) to "Copias e impresiones" (ID 5)
UPDATE products SET category_id = 5 WHERE category_id = 1;

-- 2. Move products from "Material de Oficina" (ID 3) to "Material de oficina" (ID 7)
UPDATE products SET category_id = 7 WHERE category_id = 3;

-- 3. Delete the old categories
DELETE FROM categories WHERE id IN (1, 3);

-- 4. Verify/Update slugs for remaining categories to ensure consistency (optional but good)
-- ID 2: utiles-escolares (Keep)
-- ID 4: regalos (Keep)
-- ID 5: copias-e-impresiones (Keep)
-- ID 7: material-de-oficina (Keep)
