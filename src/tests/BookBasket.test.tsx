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
});