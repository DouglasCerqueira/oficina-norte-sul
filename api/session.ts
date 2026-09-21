import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createSessionCookie, clearSessionCookie, getRole } from './_lib/session.js'
import { jsonError } from './_lib/http.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { role } = req.body ?? {}
    if (role !== 'editor' && role !== 'viewer') {
      return jsonError(res, 400, 'Perfil inválido.')
    }
    res.setHeader('Set-Cookie', createSessionCookie(role))
    return res.status(200).json({ role })
  }

  if (req.method === 'GET') {
    const role = getRole(req)
    return res.status(200).json({ role })
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearSessionCookie())
    return res.status(200).json({ role: null })
  }

  return jsonError(res, 405, 'Método não permitido.')
}