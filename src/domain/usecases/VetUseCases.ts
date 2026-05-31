import { IVetRepository } from '../repositories/IVetRepository';
import { Vet } from '../entities/Vet';

export const getVetsUseCase = (repo: IVetRepository) => (): Promise<Vet[]> =>
    repo.getAll();

export const getVetByIdUseCase =
    (repo: IVetRepository) => (id: string): Promise<Vet | null> =>
        repo.getById(id);
