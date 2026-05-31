import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { ProductCategory } from '@/domain/entities/Product';
import { ALL_PRODUCTS } from '../datasources/mock/seed';
import { mockDelay } from '../datasources/mock/mockUtils';

export const productRepository: IProductRepository = {
    getAll: () => mockDelay(ALL_PRODUCTS),
    getByCategory: (category: ProductCategory | 'All') =>
        mockDelay(
            category === 'All'
                ? ALL_PRODUCTS
                : ALL_PRODUCTS.filter(p => p.category === category),
        ),
    getById: id => mockDelay(ALL_PRODUCTS.find(p => p.id === id) ?? null),
};
