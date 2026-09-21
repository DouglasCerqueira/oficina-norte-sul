import { createHmac, timingSafeEqual } from 'crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Role } from '../../src/types/session'

const COOKIE_NAME = 'ons_session'

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET não configurado.')
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function createSessionCookie(role: Role): string {
  const signature = sign(role)
  const value = `${role}.${signature}`
  const isProd = process.env.NODE_ENV === 'production'
  return [
    `${COOKIE_NAME}=${value}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    isProd ? 'Secure' : '',
    `Max-Age=${60 * 60 * 8}`, // 8 horas
  ].filter(Boolean).join('; ')
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`
}

export function getRole(req: VercelRequest): Role | null {
  const cookieHeader = req.headers.cookie
  if (!cookieHeader) return null

  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null

  const value = match.slice(COOKIE_NAME.length + 1)
  const [role, signature] = value.split('.')
  if (!role || !signature) return null
  if (role !== 'editor' && role !== 'viewer') return null

  const expected = sign(role)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  return role as Role
}

export function requireEditor(req: VercelRequest, res: VercelResponse): boolean {
  const role = getRole(req)
  if (role !== 'editor') {
    res.status(403).json({ error: 'Este perfil é somente leitura.' })
    return false
  }
  return true
}