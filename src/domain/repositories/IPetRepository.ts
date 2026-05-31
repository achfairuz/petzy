import { Pet } from '../entities/Pet';

export interface IPetRepository {
    getAll(): Promise<Pet[]>;
    getMine(): Promise<Pet[]>;
    getById(id: string): Promise<Pet | null>;
    create(input: Omit<Pet, 'id'>): Promise<Pet>;
    update(id: string, patch: Partial<Omit<Pet, 'id'>>): Promise<Pet>;
    remove(id: string): Promise<void>;
}
