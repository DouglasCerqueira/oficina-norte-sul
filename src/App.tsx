import { useEffect, useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { CollaboratorsPage } from './pages/CollaboratorsPage'
import { getCurrentRole, logout } from './services/session'
import type { Role } from './types/session'

function App() {
  const [role, setRole] = useState<Role | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    getCurrentRole()
      .then(setRole)
      .finally(() => setCheckingSession(false))
  }, [])

  async function handleLogout() {
    await logout()
    setRole(null)
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Carregando...
      </div>
    )
  }

  if (!role) {
    return <LoginPage onLoggedIn={setRole} />
  }

  return <CollaboratorsPage role={role} onLogout={handleLogout} />
}

export default App