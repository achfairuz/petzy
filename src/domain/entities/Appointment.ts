export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
    id: string;
    petName: string;
    petImage: string;
    vetName: string;
    clinic: string;
    serviceType: 'Checkup' | 'Vaccination' | 'Grooming' | 'Surgery';
    dateISO: string;
    status: AppointmentStatus;
}
