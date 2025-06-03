import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './pages/App.tsx'

createRoot(document.getElementById('react-extension-root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
