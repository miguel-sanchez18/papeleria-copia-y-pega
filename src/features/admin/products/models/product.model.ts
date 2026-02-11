
export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number | string;
    category_id: number;
    image_url: string | null;
    is_active: boolean;
    stock_quantity: number;
    track_stock: boolean;
    category?: string; // Opt for join
    category_name?: string; // Opt for join
}
