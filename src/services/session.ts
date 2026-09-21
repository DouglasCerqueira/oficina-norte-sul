import type { Role } from '../types/session'

export async function login(role: Role): Promise<void> {
  const res = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  })
  if (!res.ok) throw new Error('Falha ao entrar.')
}

export async function getCurrentRole(): Promise<Role | null> {
  const res = await fetch('/api/session')
  const data = await res.json()
  return data.role
}

export async function logout(): Promise<void> {
  await fetch('/api/session', { method: 'DELETE' })
}