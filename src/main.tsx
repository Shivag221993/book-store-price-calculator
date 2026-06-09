import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BookBasket }from './component/BookBasket.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BookBasket />
  </StrictMode>,
)
