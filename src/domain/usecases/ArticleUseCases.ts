import { IArticleRepository } from '../repositories/IArticleRepository';
import { Article } from '../entities/Article';

export const getArticlesUseCase = (repo: IArticleRepository) => (): Promise<Article[]> =>
    repo.getAll();

export const getArticleByIdUseCase =
    (repo: IArticleRepository) => (id: string): Promise<Article | null> =>
        repo.getById(id);
