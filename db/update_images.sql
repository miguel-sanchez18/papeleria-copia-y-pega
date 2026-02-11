-- Update images with placeholders
-- Using placehold.co for reliable placeholders

UPDATE products 
SET image_url = 'https://placehold.co/600x400/1e293b/ffffff?text=' || REPLACE(name, ' ', '+')
WHERE image_url IS NULL OR image_url LIKE '/assets/%';
