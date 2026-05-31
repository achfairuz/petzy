export type VetSpecialty = 'General' | 'Dermatology' | 'Surgery' | 'Dental' | 'Nutrition';

export interface Vet {
    id: string;
    name: string;
    specialty: VetSpecialty;
    clinic: string;
    distanceKm: number;
    rating: number;
    reviewCount: number;
    pricePerVisit: number;
    avatarUrl: string;
    availableToday: boolean;
}
