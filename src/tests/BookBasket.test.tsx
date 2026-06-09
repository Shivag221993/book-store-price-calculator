import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookBasket } from '../component/BookBasket';

describe('BookBasket Component UI (Vitest)', () => {
  
  test('should mount the component header and structural layouts properly', () => {
    render(<BookBasket />);
    
    expect(
      screen.getByText((_, element) => element?.textContent === 'Developer Book Store')
    ).toBeInTheDocument();
    
    expect(
      screen.getByText((_, element) => element?.textContent === 'Total Books: 0')
    ).toBeInTheDocument();
    
    expect(screen.getByText('€0.00')).toBeInTheDocument();
  });

  test('should display all five available classic softdev book rows', () => {
    render(<BookBasket />);

    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('The Clean Coder')).toBeInTheDocument();
    expect(screen.getByText('Clean Architecture')).toBeInTheDocument();
    expect(screen.getByText('Test Driven Development by Example')).toBeInTheDocument();
    expect(screen.getByText('Working Effectively With Legacy Code')).toBeInTheDocument();
  });

  test('should increment total counters and display new totals upon user click events', () => {
    render(<BookBasket />);

    const incrementButtons = screen.getAllByRole('button', { name: /Increase/i });
    
    fireEvent.click(incrementButtons[0]);

    expect(
      screen.getByText((_, element) => element?.textContent === 'Total Books: 1')
    ).toBeInTheDocument();
    
    expect(screen.getByText('€50.00')).toBeInTheDocument();
  });

  test('should reduce total values cleanly when subtraction triggers are executed', () => {
    render(<BookBasket />);

    const incrementButtons = screen.getAllByRole('button', { name: /Increase/i });
    const decrementButtons = screen.getAllByRole('button', { name: /Decrease/i });

    fireEvent.click(incrementButtons[2]);
    fireEvent.click(incrementButtons[2]);
    
    expect(
      screen.getByText((_, element) => element?.textContent === 'Total Books: 2')
    ).toBeInTheDocument();
    expect(screen.getByText('€100.00')).toBeInTheDocument();

    fireEvent.click(decrementButtons[2]);
    
    expect(
      screen.getByText((_, element) => element?.textContent === 'Total Books: 1')
    ).toBeInTheDocument();
    expect(screen.getByText('€50.00')).toBeInTheDocument();
  });

  test('should dynamically evaluate real-time multi-set discount computations upon combined clicks', () => {
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