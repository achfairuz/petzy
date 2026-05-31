import { create } from 'zustand';

export interface Address {
    id: string;
    label: string;
    recipient: string;
    phone: string;
    line: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
}

export type PaymentBrand = 'Visa' | 'Mastercard' | 'GoPay' | 'OVO' | 'BCA';

export interface PaymentMethod {
    id: string;
    brand: PaymentBrand;
    label: string;
    last4: string;
    isDefault: boolean;
}

export interface AppPreferences {
    pushNotifications: boolean;
    emailNotifications: boolean;
    promotions: boolean;
    darkMode: boolean;
    language: 'en' | 'id';
}

interface SettingsState {
    addresses: Address[];
    paymentMethods: PaymentMethod[];
    preferences: AppPreferences;

    addAddress: (input: Omit<Address, 'id'>) => void;
    updateAddress: (id: string, patch: Partial<Omit<Address, 'id'>>) => void;
    removeAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;

    addPayment: (input: Omit<PaymentMethod, 'id'>) => void;
    removePayment: (id: string) => void;
    setDefaultPayment: (id: string) => void;

    setPreference: <K extends keyof AppPreferences>(
        key: K,
        value: AppPreferences[K],
    ) => void;
}

const randomId = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useSettingsStore = create<SettingsState>((set, get) => ({
    addresses: [
        {
            id: 'addr-home',
            label: 'Home',
            recipient: 'Petzy User',
            phone: '+62 812 3456 7890',
            line: 'Jl. Cendrawasih No. 12, Apt 3B',
            city: 'Jakarta Selatan',
            postalCode: '12150',
            isDefault: true,
        },
    ],
    paymentMethods: [
        {
            id: 'pm-visa',
            brand: 'Visa',
            label: 'Personal',
            last4: '4242',
            isDefault: true,
        },
        {
            id: 'pm-gopay',
            brand: 'GoPay',
            label: 'Wallet',
            last4: '7890',
            isDefault: false,
        },
    ],
    preferences: {
        pushNotifications: true,
        emailNotifications: false,
        promotions: true,
        darkMode: false,
        language: 'en',
    },

    addAddress: input => {
        const newAddr: Address = { ...input, id: randomId() };
        let list = [...get().addresses, newAddr];
        if (newAddr.isDefault) {
            list = list.map(a => ({ ...a, isDefault: a.id === newAddr.id }));
        }
        set({ addresses: list });
    },
    updateAddress: (id, patch) => {
        let list = get().addresses.map(a => (a.id === id ? { ...a, ...patch } : a));
        if (patch.isDefault) {
            list = list.map(a => ({ ...a, isDefault: a.id === id }));
        }
        set({ addresses: list });
    },
    removeAddress: id =>
        set({ addresses: get().addresses.filter(a => a.id !== id) }),
    setDefaultAddress: id =>
        set({
            addresses: get().addresses.map(a => ({
                ...a,
                isDefault: a.id === id,
            })),
        }),

    addPayment: input => {
        const newPm: PaymentMethod = { ...input, id: randomId() };
        let list = [...get().paymentMethods, newPm];
        if (newPm.isDefault) {
            list = list.map(p => ({ ...p, isDefault: p.id === newPm.id }));
        }
        set({ paymentMethods: list });
    },
    removePayment: id =>
        set({ paymentMethods: get().paymentMethods.filter(p => p.id !== id) }),
    setDefaultPayment: id =>
        set({
            paymentMethods: get().paymentMethods.map(p => ({
                ...p,
                isDefault: p.id === id,
            })),
        }),

    setPreference: (key, value) =>
        set({ preferences: { ...get().preferences, [key]: value } }),
}));
