export type ProductCategory = 'Food' | 'Toys' | 'Health' | 'Accessories' | 'Grooming';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: ProductCategory;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    discountPercent?: number;
}
