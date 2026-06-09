import { useState, useMemo } from 'react';

export interface Basket {
  [bookId: string]: number;
}

const BOOK_PRICE = 50;
const DISCOUNTS: { [key: number]: number } = {
  1: 0,
  2: 0.05,
  3: 0.10,
  4: 0.20,
  5: 0.25,
};

export const useBookPricing = (initialBooks: string[]) => {
  const [basket, setBasket] = useState<Basket>(() =>
    initialBooks.reduce((acc, id) => ({ ...acc, [id]: 0 }), {})
  );

  const calculateBestPrice = (currentBasket: Basket): number => {
    const quantities = Object.values(currentBasket)
      .filter((q) => q > 0)
      .sort((a, b) => b - a);

    const memo: { [key: string]: number } = {};

    const getMinPrice = (counts: number[]): number => {
      const activeCounts = counts.filter((c) => c > 0).sort((a, b) => b - a);
      if (activeCounts.length === 0) return 0;

      const key = activeCounts.join(',');
      if (key in memo) return memo[key];

      let minTotal = Infinity;
      const maxPossibleGroupSize = activeCounts.length;

      for (let size = 1; size <= maxPossibleGroupSize; size++) {
        const nextCounts = [...activeCounts];
        
        for (let i = 0; i < size; i++) {
          nextCounts[i]--;
        }

        const groupCost = size * BOOK_PRICE * (1 - DISCOUNTS[size]);
        const totalCost = groupCost + getMinPrice(nextCounts);

        if (totalCost < minTotal) {
          minTotal = totalCost;
        }
      }

      memo[key] = minTotal;
      return minTotal;
    };

    return getMinPrice(quantities);
  };

  const updateQuantity = (id: string, amount: number) => {
    setBasket((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + amount),
    }));
  };

  const totalPrice = useMemo(() => calculateBestPrice(basket), [basket]);
  const totalItems = useMemo(() => Object.values(basket).reduce((a, b) => a + b, 0), [basket]);

  return {
    basket,
    totalPrice,
    totalItems,
    updateQuantity,
  };
};