import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { CustomerApp } from './customer/CustomerApp'

const isCustomerRoute = window.location.pathname.startsWith('/descobrir')
const root = isCustomerRoute ? <CustomerApp /> : <App />

createRoot(document.getElementById('root')!).render(
  <StrictMode>{root}</StrictMode>,
)
