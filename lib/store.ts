import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string; // For future when sizes/colors are selectable directly in cart
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      addItem: (product, quantity) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product.id === product.id);
        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = currentItems.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedItems = [...currentItems, { product, quantity }];
        }
        const newSubtotal = updatedItems.reduce((total, item) => {
          const unitPrice = item.product.sale_price ?? item.product.price ?? 0;
          return total + unitPrice * item.quantity;
        }, 0);
        set({ items: updatedItems, subtotal: newSubtotal });
      },
      removeItem: (productId) => {
        const updatedItems = get().items.filter(item => item.product.id !== productId);
        const newSubtotal = updatedItems.reduce((total, item) => {
          const unitPrice = item.product.sale_price ?? item.product.price ?? 0;
          return total + unitPrice * item.quantity;
        }, 0);
        set({ items: updatedItems, subtotal: newSubtotal });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const updatedItems = get().items.map(item => 
          item.product.id === productId ? { ...item, quantity } : item
        );
        const newSubtotal = updatedItems.reduce((total, item) => {
          const unitPrice = item.product.sale_price ?? item.product.price ?? 0;
          return total + unitPrice * item.quantity;
        }, 0);
        set({ items: updatedItems, subtotal: newSubtotal });
      },
      clearCart: () => set({ items: [], subtotal: 0 }),
    }),
    {
      name: 'ms-traders-cart',
    }
  )
);
