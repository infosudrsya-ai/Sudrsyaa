
import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Category, ELIGIBLE_FOR_OFFER, Coupon } from './types';
import { firestoreHelpers } from './firebase';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sudrsya_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState({ buy2get1Enabled: true });
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    localStorage.setItem('sudrsya_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    firestoreHelpers.getSettings().then(s => setSettings(s as any));
  }, []);

  const addToCart = (product: Product) => {
    if (product.isSoldOut) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const applyCoupon = async (code: string) => {
    const coupons = await firestoreHelpers.getCoupons() as Coupon[];
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (coupon) {
      setActiveCoupon(coupon);
      return { success: true, message: 'Coupon applied!' };
    }
    return { success: false, message: 'Invalid or inactive coupon' };
  };

  const removeCoupon = () => setActiveCoupon(null);

  const getOfferDetails = useCallback(() => {
    const eligibleCategories = ELIGIBLE_FOR_OFFER;
    const itemsByCategory: Record<string, CartItem[]> = {};

    cart.forEach(item => {
      if (eligibleCategories.includes(item.category)) {
        if (!itemsByCategory[item.category]) itemsByCategory[item.category] = [];
        for(let i = 0; i < item.quantity; i++) {
           itemsByCategory[item.category].push({ ...item, quantity: 1 });
        }
      }
    });

    let b2g1Discount = 0;
    const messages: string[] = [];
    const freeItems: string[] = [];

    if (settings.buy2get1Enabled) {
      Object.entries(itemsByCategory).forEach(([category, items]) => {
        items.sort((a, b) => a.price - b.price);
        const setSize = 3;
        const count = items.length;
        const numFree = Math.floor(count / setSize);
        if (numFree > 0) {
          for (let i = 0; i < numFree; i++) {
            b2g1Discount += items[i].price;
            freeItems.push(items[i].name);
          }
        }
        const remainder = count % setSize;
        if (remainder === 1) {
          messages.push(`Buy 1 more ${category} and get 1 FREE!`);
        } else if (remainder === 2) {
          messages.push(`Add just 1 more ${category} to unlock your FREE gift!`);
        }
      });
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    let couponDiscount = 0;
    if (activeCoupon) {
      if (activeCoupon.type === 'percentage') {
        couponDiscount = (subtotal - b2g1Discount) * (activeCoupon.value / 100);
      } else {
        couponDiscount = Math.min(activeCoupon.value, subtotal - b2g1Discount);
      }
    }

    const total = subtotal - b2g1Discount - couponDiscount;

    return { 
      subtotal, 
      discount: b2g1Discount, 
      couponDiscount,
      activeCoupon,
      total, 
      messages, 
      freeItems 
    };
  }, [cart, settings, activeCoupon]);

  return { cart, addToCart, removeFromCart, updateQuantity, getOfferDetails, applyCoupon, removeCoupon };
};
