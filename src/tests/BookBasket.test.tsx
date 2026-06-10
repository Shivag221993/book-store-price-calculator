import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookBasket } from '../component/BookBasket';

describe('BookBasket UI - Structural Integrity', () => {
  test('should display the main bookstore heading layout elements', () => {
    render(<BookBasket />);
    expect(
      screen.getByText((_, element) => element?.textContent === 'Developer Book Store')
    ).toBeInTheDocument();
  });

  test('should display the initial promotional subtitle message', () => {
    render(<BookBasket />);
    expect(screen.getByText('Maximize your skills, maximize your discounts!')).toBeInTheDocument();
  });

  test('should show initial total books indicator equal to 0', () => {
    render(<BookBasket />);
    expect(
      screen.getByText((_, element) => element?.textContent === 'Total Books: 0')
    ).toBeInTheDocument();
  });

  test('should initialize total checkout price to 0.00 currency label', () => {
    render(<BookBasket />);
    expect(screen.getByText('€0.00')).toBeInTheDocument();
  });
});

describe('BookBasket UI - Catalog Listing Visibility', () => {
  test('should verify row listing for Clean Code book exists', () => {
    render(<BookBasket />);
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
  });

  test('should verify row listing for The Clean Coder book exists', () => {
    render(<BookBasket />);
    expect(screen.getByText('The Clean Coder')).toBeInTheDocument();
  });

  test('should verify row listing for Clean Architecture book exists', () => {
    render(<BookBasket />);
    expect(screen.getByText('Clean Architecture')).toBeInTheDocument();
  });

  test('should verify row listing for Test Driven Development book exists', () => {
    render(<BookBasket />);
    expect(screen.getByText('Test Driven Development by Example')).toBeInTheDocument();
  });

  test('should verify row listing for Legacy Code book exists', () => {
    render(<BookBasket />);
    expect(screen.getByText('Working Effectively With Legacy Code')).toBeInTheDocument();
  });
});

describe('BookBasket UI - Quantity Manipulations', () => {
  test('should increase individual quantity field displays from 0 to 1 upon clicking plus button', () => {
    render(<BookBasket />);
    const incrementButtons = screen.getAllByRole('button', { name: /Increase/i });
    fireEvent.click(incrementButtons[0]);
    expect(screen.getAllByText('1')[0]).toBeInTheDocument();
  });

  test('should change aggregate total books calculation output text on structural row additions', () => {
    render(<BookBasket />);
    const incrementButtons = screen.getAllByRole('button', { name: /Increase/i });
    fireEvent.click(incrementButtons[0]);
    expect(
      screen.getByText((_, element) => element?.textContent === 'Total Books: 1')
    ).toBeInTheDocument();
  });

  test('should scale prices proportionally when adding singular books', () => {
    render(<BookBasket />);
    const incrementButtons = screen.getAllByRole('button', { name: /Increase/i });
    fireEvent.click(incrementButtons[0]);
    expect(screen.getByText('€50.00')).toBeInTheDocument();
  });

  test('should allow decrementing item displays back down from added states', () => {
    render(<BookBasket />);
    const incrementButtons = screen.getAllByRole('button', { name: /Increase/i });
    const decrementButtons = screen.getAllByRole('button', { name: /Decrease/i });
    
    fireEvent.click(incrementButtons[1]);
    fireEvent.click(decrementButtons[1]);
    
    expect(
      screen.getByText((_, element) => element?.textContent === 'Total Books: 0')
    ).toBeInTheDocument();
  });

  test('should lower corresponding global pricing sums upon removal triggers', () => {
    render(<BookBasket />);
    const incrementButtons = screen.getAllByRole('button', { name: /Increase/i });
    const decrementButtons = screen.getAllByRole('button', { name: /Decrease/i });
    
    fireEvent.click(incrementButtons[1]);
    fireEvent.click(incrementButtons[1]);
    fireEvent.click(decrementButtons[1]);
    
    expect(screen.getByText('€50.00')).toBeInTheDocument();
  });
});

describe('BookBasket UI - Interactive Discount Combinations', () => {
  test('should update display parameters with an active discount layout for distinct selections', () => {
    render(<BookBasket />);
    const incrementButtons = screen.getAllByRole('button', { name: /Increase/i });

    fireEvent.click(incrementButtons[0]);
    fireEvent.click(incrementButtons[4]);

    expect(
      screen.getByText((_, element) => element?.textContent === 'Total Books: 2')
    ).toBeInTheDocument();
    expect(screen.getByText('€95.00')).toBeInTheDocument();
  });
});