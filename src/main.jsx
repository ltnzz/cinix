import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Cinix from './landingpage.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cinix />
  </StrictMode>,
)
