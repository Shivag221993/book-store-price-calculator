import { describe, test, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBookPricing } from "../hooks/useBookPricing";

const TEST_BOOK_IDS = ["book-1", "book-2", "book-3", "book-4", "book-5"];

describe("useBookPricing - Baseline and Empty States", () => {
  test("should report 0 items when initialized", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    expect(result.current.totalItems).toBe(0);
  });

  test("should report 0 EUR price when initialized", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    expect(result.current.totalPrice).toBe(0);
  });

  test("should initialize all book counts to 0", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    expect(result.current.basket["book-1"]).toBe(0);
    expect(result.current.basket["book-2"]).toBe(0);
    expect(result.current.basket["book-3"]).toBe(0);
    expect(result.current.basket["book-4"]).toBe(0);
    expect(result.current.basket["book-5"]).toBe(0);
  });
});

describe("useBookPricing - Single Item Operations", () => {
  test("should increase count to 1 when a book is added", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 1);
    });
    expect(result.current.basket["book-1"]).toBe(1);
  });

  test("should calculate standard non-discounted price for exactly 1 book", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 1);
    });
    expect(result.current.totalPrice).toBe(50);
  });

  test("should accumulate total items correctly for single items", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 1);
    });
    expect(result.current.totalItems).toBe(1);
  });
});

describe("useBookPricing - Repetitive and Bound Control", () => {
  test("should handle multiple copies of the exact same item without any discount", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 3);
    });
    expect(result.current.totalPrice).toBe(150);
  });

  test("should accurately aggregate absolute item counts for repetitive identical items", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 3);
    });
    expect(result.current.totalItems).toBe(3);
  });

  test("should stop item decrements at zero boundaries", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", -1);
    });
    expect(result.current.basket["book-1"]).toBe(0);
  });

  test("should maintain 0 price when attempting to decrement empty items", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", -1);
    });
    expect(result.current.totalPrice).toBe(0);
  });

  test("should allow subtracting down to a positive value from a higher count", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 3);
      result.current.updateQuantity("book-1", -1);
    });
    expect(result.current.basket["book-1"]).toBe(2);
    expect(result.current.totalPrice).toBe(100);
  });
});

describe("useBookPricing - Progressive Discount Tiers", () => {
  test("should apply a 5% discount for a collection of 2 unique books", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 1);
      result.current.updateQuantity("book-2", 1);
    });
    expect(result.current.totalPrice).toBe(95);
  });

  test("should apply a 10% discount for a collection of 3 unique books", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 1);
      result.current.updateQuantity("book-2", 1);
      result.current.updateQuantity("book-3", 1);
    });
    expect(result.current.totalPrice).toBe(135);
  });

  test("should apply a 20% discount for a collection of 4 unique books", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 1);
      result.current.updateQuantity("book-2", 1);
      result.current.updateQuantity("book-3", 1);
      result.current.updateQuantity("book-4", 1);
    });
    expect(result.current.totalPrice).toBe(160);
  });

  test("should apply a 25% discount for a collection of 5 unique books", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 1);
      result.current.updateQuantity("book-2", 1);
      result.current.updateQuantity("book-3", 1);
      result.current.updateQuantity("book-4", 1);
      result.current.updateQuantity("book-5", 1);
    });
    expect(result.current.totalPrice).toBe(187.5);
  });
});

describe("useBookPricing - Advanced Mixed Partitions", () => {
  test("should calculate a combination of a 2-book discount bundle and a full-price leftover copy", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 2);
      result.current.updateQuantity("book-2", 1);
    });
    expect(result.current.totalPrice).toBe(145);
  });

  test("should isolate separate discount tiers across two unique sets of books", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 2);
      result.current.updateQuantity("book-2", 2);
      result.current.updateQuantity("book-3", 1);
    });
    expect(result.current.totalPrice).toBe(230);
  });

  test("should compute mixed packages with multiple trailing full-price individual titles", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 3);
      result.current.updateQuantity("book-2", 1);
    });
    expect(result.current.totalPrice).toBe(195);
  });
});

describe("useBookPricing - Global Optimization Edge Case", () => {
  test("should break a 5-and-3 item distribution into two groups of 4 for lowest price configuration", () => {
    const { result } = renderHook(() => useBookPricing(TEST_BOOK_IDS));
    act(() => {
      result.current.updateQuantity("book-1", 2);
      result.current.updateQuantity("book-2", 2);
      result.current.updateQuantity("book-3", 2);
      result.current.updateQuantity("book-4", 1);
      result.current.updateQuantity("book-5", 1);
    });
    expect(result.current.totalPrice).toBe(320);
  });
});
