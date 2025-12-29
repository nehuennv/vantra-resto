import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ReservationsProvider } from './context/ReservationsContext.jsx' // <--- IMPORTAR

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ReservationsProvider> {/* <--- ENVOLVER AQUI */}
        <App />
      </ReservationsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)