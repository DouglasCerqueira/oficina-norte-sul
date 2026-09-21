import { useState } from 'react'
import { login } from '../services/session'
import type { Role } from '../types/session'

interface LoginPageProps {
  onLoggedIn: (role: Role) => void
}

export function LoginPage({ onLoggedIn }: LoginPageProps) {
  const [loading, setLoading] = useState<Role | null>(null)

  async function handleClick(role: Role) {
    setLoading(role)
    try {
      await login(role)
      onLoggedIn(role)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-slate-800 mb-1">Oficina Norte Sul</h1>
        <p className="text-sm text-slate-500 mb-6">Escolha um perfil de demonstração</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleClick('editor')}
            disabled={loading !== null}
            className="bg-slate-800 text-white rounded-md py-2 font-medium hover:bg-slate-700 disabled:opacity-50"
          >
            {loading === 'editor' ? 'Entrando...' : 'Entrar como Edição'}
          </button>
          <button
            onClick={() => handleClick('viewer')}
            disabled={loading !== null}
            className="border border-slate-300 text-slate-700 rounded-md py-2 font-medium hover:bg-slate-100 disabled:opacity-50"
          >
            {loading === 'viewer' ? 'Entrando...' : 'Entrar como Só leitura'}
          </button>
        </div>
      </div>
    </div>
  )
}