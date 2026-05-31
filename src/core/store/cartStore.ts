import { create } from 'zustand';
import { Product } from '@/domain/entities/Product';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    add: (product: Product) => void;
    remove: (productId: string) => void;
    increment: (productId: string) => void;
    decrement: (productId: string) => void;
    clear: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

const priceAfterDiscount = (p: Product): number =>
    p.discountPercent ? Math.round(p.price * (1 - p.discountPercent / 100)) : p.price;

export const useCartStore = create<CartState>((set, get) => ({
    items: [],

    add: (product) => {
        const existing = get().items.find(i => i.product.id === product.id);
        if (existing) {
            set({
                items: get().items.map(i =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
                ),
            });
        } else {
            set({ items: [...get().items, { product, quantity: 1 }] });
        }
    },

    remove: (productId) =>
        set({ items: get().items.filter(i => i.product.id !== productId) }),

    increment: (productId) =>
        set({
            items: get().items.map(i =>
                i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i,
            ),
        }),

    decrement: (productId) =>
        set({
            items: get()
                .items.map(i =>
                    i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
                )
                .filter(i => i.quantity > 0),
        }),

    clear: () => set({ items: [] }),

    totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

    totalPrice: () =>
        get().items.reduce((sum, i) => sum + priceAfterDiscount(i.product) * i.quantity, 0),
}));

export const productDisplayPrice = priceAfterDiscount;
