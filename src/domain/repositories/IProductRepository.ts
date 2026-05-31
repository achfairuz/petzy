import { Product, ProductCategory } from '../entities/Product';

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    getByCategory(category: ProductCategory | 'All'): Promise<Product[]>;
    getById(id: string): Promise<Product | null>;
}
