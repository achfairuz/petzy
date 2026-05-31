import { create } from 'zustand';
import { Pet } from '@/domain/entities/Pet';
import { petRepository } from '@/data/repositories/petRepository';
import {
    createPetUseCase,
    getMyPetsUseCase,
    removePetUseCase,
    updatePetUseCase,
} from '@/domain/usecases/PetUseCases';

const getMyPets = getMyPetsUseCase(petRepository);
const createPet = createPetUseCase(petRepository);
const updatePet = updatePetUseCase(petRepository);
const removePet = removePetUseCase(petRepository);

interface PetsState {
    pets: Pet[];
    loading: boolean;
    load: () => Promise<void>;
    add: (input: Omit<Pet, 'id'>) => Promise<Pet>;
    update: (id: string, patch: Partial<Omit<Pet, 'id'>>) => Promise<Pet>;
    remove: (id: string) => Promise<void>;
    getById: (id: string) => Pet | undefined;
}

export const usePetsStore = create<PetsState>((set, get) => ({
    pets: [],
    loading: false,
    load: async () => {
        set({ loading: true });
        try {
            const pets = await getMyPets();
            set({ pets, loading: false });
        } catch {
            set({ loading: false });
        }
    },
    add: async input => {
        const created = await createPet(input);
        set({ pets: [created, ...get().pets] });
        return created;
    },
    update: async (id, patch) => {
        const updated = await updatePet(id, patch);
        set({ pets: get().pets.map(p => (p.id === id ? updated : p)) });
        return updated;
    },
    remove: async id => {
        await removePet(id);
        set({ pets: get().pets.filter(p => p.id !== id) });
    },
    getById: id => get().pets.find(p => p.id === id),
}));
