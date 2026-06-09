import { useBookPricing } from '../hooks/useBookPricing';
import './BookBasket.css';

interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
}

const AVAILABLE_BOOKS: Book[] = [
  { id: 'clean-code', title: 'Clean Code', author: 'Robert Martin', year: 2008 },
  { id: 'clean-coder', title: 'The Clean Coder', author: 'Robert Martin', year: 2011 },
  { id: 'clean-arch', title: 'Clean Architecture', author: 'Robert Martin', year: 2017 },
  { id: 'tdd', title: 'Test Driven Development by Example', author: 'Kent Beck', year: 2003 },
  { id: 'legacy-code', title: 'Working Effectively With Legacy Code', author: 'Michael C. Feathers', year: 2004 },
];

const BOOK_IDS = AVAILABLE_BOOKS.map(b => b.id);

export function BookBasket() {
  const {
    basket,
    totalPrice,
    totalItems,
    updateQuantity,
  } = useBookPricing(BOOK_IDS);

  return (
    <div className="basket-container">
      <h2 className="basket-title">Developer Book Store</h2>
      <p className="basket-subtitle">Maximize your skills, maximize your discounts!</p>
      
      <hr className="divider" />

      <div className="book-list">
      </div>

      <div className="summary-card">
        <div className="summary-info">
          <div>Total Books: <strong>{totalItems}</strong></div>
          <small>Discounts automatically optimized</small>
        </div>
        <div className="summary-price">
          €{totalPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
}