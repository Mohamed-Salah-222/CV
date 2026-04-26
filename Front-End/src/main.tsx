import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import { SettingsProvider } from './contexts/SettingsContext'
import { env } from './config/env'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={env.CLERK_PUBLISHABLE_KEY}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </ClerkProvider>
  </StrictMode>,
)
