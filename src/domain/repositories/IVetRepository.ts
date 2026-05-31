import { Vet } from '../entities/Vet';

export interface IVetRepository {
    getAll(): Promise<Vet[]>;
    getById(id: string): Promise<Vet | null>;
}
