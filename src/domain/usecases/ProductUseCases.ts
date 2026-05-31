import { IProductRepository } from '../repositories/IProductRepository';
import { Product, ProductCategory } from '../entities/Product';

export const getProductsUseCase = (repo: IProductRepository) => (): Promise<Product[]> =>
    repo.getAll();

export const getProductsByCategoryUseCase =
    (repo: IProductRepository) =>
        (category: ProductCategory | 'All'): Promise<Product[]> =>
            repo.getByCategory(category);

export const getProductByIdUseCase =
    (repo: IProductRepository) => (id: string): Promise<Product | null> =>
        repo.getById(id);
