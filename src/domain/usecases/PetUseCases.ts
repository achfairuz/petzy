import { IPetRepository } from '../repositories/IPetRepository';
import { Pet } from '../entities/Pet';

export const getPetsUseCase = (repo: IPetRepository) => (): Promise<Pet[]> =>
    repo.getAll();

export const getMyPetsUseCase = (repo: IPetRepository) => (): Promise<Pet[]> =>
    repo.getMine();

export const getPetByIdUseCase =
    (repo: IPetRepository) => (id: string): Promise<Pet | null> =>
        repo.getById(id);

export const createPetUseCase =
    (repo: IPetRepository) => (input: Omit<Pet, 'id'>): Promise<Pet> =>
        repo.create(input);

export const updatePetUseCase =
    (repo: IPetRepository) =>
        (id: string, patch: Partial<Omit<Pet, 'id'>>): Promise<Pet> =>
            repo.update(id, patch);

export const removePetUseCase =
    (repo: IPetRepository) => (id: string): Promise<void> =>
        repo.remove(id);
