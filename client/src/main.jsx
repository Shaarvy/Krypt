import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TransactionsProvider } from './context/TransactionContext';

createRoot(document.getElementById('root')).render(
  <TransactionsProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </TransactionsProvider>
)
