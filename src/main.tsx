import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Estilos do projeto original mantidos
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
