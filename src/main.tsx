import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { theme } from './theme'
import { AuthProvider } from './auth/AuthProvider'
import { SnackProvider } from './ui/Snack'
import App from './App'

// Initialize React Query client for managing server state and caching
const qc = new QueryClient()

// Render app with provider hierarchy:
// - QueryClientProvider: manages API requests and caching
// - ThemeProvider: applies Material-UI theme
// - BrowserRouter: enables client-side routing
// - AuthProvider: manages authentication state
// - SnackProvider: handles notification messages
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <SnackProvider>
              <App />
            </SnackProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)