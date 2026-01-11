import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ReservationsProvider } from './context/ReservationsContext.jsx'
import { MenuProvider } from './context/MenuContext.jsx'

import { applyClientTheme } from './lib/theme'

// Aplicar tema dinámico del cliente (Aura)
applyClientTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ReservationsProvider>
        <MenuProvider>
          <App />
        </MenuProvider>
      </ReservationsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)