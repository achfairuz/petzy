import { IPetRepository } from '@/domain/repositories/IPetRepository';
import { ALL_PETS, MY_PETS } from '../datasources/mock/seed';
import { mockDelay, mockId } from '../datasources/mock/mockUtils';
import { Pet } from '@/domain/entities/Pet';

const myStore: Pet[] = [...MY_PETS];

export const petRepository: IPetRepository = {
    getAll: () => mockDelay(ALL_PETS),
    getMine: () => mockDelay([...myStore]),
    getById: id => {
        const pet = myStore.find(p => p.id === id) ?? ALL_PETS.find(p => p.id === id) ?? null;
        return mockDelay(pet);
    },
    create: input => {
        const created: Pet = { ...input, id: mockId() };
        myStore.unshift(created);
        return mockDelay(created);
    },
    update: (id, patch) => {
        const index = myStore.findIndex(p => p.id === id);
        if (index < 0) {
            return Promise.reject(new Error('Pet not found'));
        }
        const updated: Pet = { ...myStore[index], ...patch };
        myStore[index] = updated;
        return mockDelay(updated);
    },
    remove: id => {
        const index = myStore.findIndex(p => p.id === id);
        if (index >= 0) myStore.splice(index, 1);
        return mockDelay(undefined as unknown as void);
    },
};
