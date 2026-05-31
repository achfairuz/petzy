export type PetSpecies = 'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other';

export interface Pet {
    id: string;
    name: string;
    species: PetSpecies;
    breed: string;
    age: string;
    weightKg: number;
    gender: 'Male' | 'Female';
    imageUrl: string;
    tag?: string;
    vaccinated: boolean;
}
