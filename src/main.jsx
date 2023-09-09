import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GetDataApi } from './contexts/GetDataApi.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GetDataApi>
<App />
</GetDataApi>
  </React.StrictMode>
   ,
)
