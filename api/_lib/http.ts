import type { VercelResponse } from '@vercel/node'

export function jsonError(res: VercelResponse, status: number, message: string) {
  return res.status(status).json({ error: message })
}