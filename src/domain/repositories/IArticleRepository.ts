import { Article } from '../entities/Article';

export interface IArticleRepository {
    getAll(): Promise<Article[]>;
    getById(id: string): Promise<Article | null>;
}
