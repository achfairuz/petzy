import { IArticleRepository } from '@/domain/repositories/IArticleRepository';
import { ALL_ARTICLES } from '../datasources/mock/seed';
import { mockDelay } from '../datasources/mock/mockUtils';

export const articleRepository: IArticleRepository = {
    getAll: () => mockDelay(ALL_ARTICLES),
    getById: id => mockDelay(ALL_ARTICLES.find(a => a.id === id) ?? null),
};
