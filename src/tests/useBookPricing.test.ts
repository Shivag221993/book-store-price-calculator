import { describe, test, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBookPricing } from "../hooks/useBookPricing";

const TEST_BOOK_IDS = ["book-1", "book-2", "book-3", "book-4", "book-5"];

describe("useBookPricing Custom Hook (Vitest)", () => {
  let rendered: ReturnType<
    typeof renderHook<ReturnType<typeof useBookPricing>, string[]>
  >;

  beforeEach(() => {
    rendered = renderHook(() => useBookPricing(TEST_BOOK_IDS));
  });

  test("should initialize with empty metrics", () => {
    const { result } = rendered;
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.basket["book-1"]).toBe(0);
  });

  test("should calculate base price of 50 EUR for a single book", () => {
    const { result } = rendered;
    act(() => {
      result.current.updateQuantity("book-1", 1);
    });
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(50);
  });

  test("should not apply discounts to multiple identical titles", () => {
    const { result } = rendered;
    act(() => {
      result.current.updateQuantity("book-2", 3);
    });
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(150);
  });

  test("should guard against negative quantities when decrementing empty items", () => {
    const { result } = rendered;
    act(() => {
      result.current.updateQuantity("book-3", -2);
    });
    expect(result.current.basket["book-3"]).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  test("should evaluate correct tier percentage offsets across distinct book configurations", () => {
    const { result } = rendered;

    act(() => {
      result.current.updateQuantity("book-1", 1);
      result.current.updateQuantity("book-2", 1);
    });
    expect(result.current.totalPrice).toBe(95);

    act(() => {
      result.current.updateQuantity("book-3", 1);
    });
    expect(result.current.totalPrice).toBe(135);

    act(() => {
      result.current.updateQuantity("book-4", 1);
    });
    expect(result.current.totalPrice).toBe(160);

    act(() => {
      result.current.updateQuantity("book-5", 1);
    });
    expect(result.current.totalPrice).toBe(187.5);
  });

  test("should calculate mixed groups combining unique sets and leftover items", () => {
    const { result } = rendered;
    act(() => {
      result.current.updateQuantity("book-1", 2);
      result.current.updateQuantity("book-2", 1);
    });
    expect(result.current.totalPrice).toBe(145);
  });

  test("should accurately optimize into two groups of 4 instead of 5 and 3", () => {
    const { result } = rendered;
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
