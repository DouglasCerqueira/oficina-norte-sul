import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../_lib/firebase.js'
import { jsonError } from '../_lib/http.js'
import { requireEditor } from '../_lib/session.js'
import { DEPARTMENTS, STATUSES } from '../../src/types/collaborator.js'
import type { HistoryEntry } from '../../src/types/collaborator.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query
  if (typeof id !== 'string') {
    return jsonError(res, 400, 'ID inválido.')
  }

  const docRef = db.collection('collaborators').doc(id)

  if (req.method === 'PUT') {
    if (!requireEditor(req, res)) return

    const { name, department, status } = req.body ?? {}

    if (typeof name !== 'string' || name.trim().length === 0) {
      return jsonError(res, 400, 'Nome é obrigatório.')
    }
    if (!DEPARTMENTS.includes(department)) {
      return jsonError(res, 400, 'Setor inválido.')
    }
    if (!STATUSES.includes(status)) {
      return jsonError(res, 400, 'Situação inválida.')
    }

    const snapshot = await docRef.get()
    if (!snapshot.exists) {
      return jsonError(res, 404, 'Colaborador não encontrado.')
    }

    const before = snapshot.data()!
    const now = new Date().toISOString()
    const changes: string[] = []
    const newName = name.trim().toUpperCase()

    if (before.name !== newName) changes.push(`Nome: ${before.name} → ${newName}`)
    if (before.department !== department) changes.push(`Setor: ${before.department} → ${department}`)
    if (before.status !== status) changes.push(`Situação: ${before.status} → ${status}`)

    const history: HistoryEntry[] = before.history ?? []
    if (changes.length > 0) {
      history.push({ changedBy: 'demo', changedAt: now, description: changes.join('; ') })
    }

    await docRef.update({
      name: newName,
      department,
      status,
      updatedAt: now,
      history,
    })

    const updated = await docRef.get()
    return res.status(200).json({ id: updated.id, ...updated.data() })
  }

  return jsonError(res, 405, 'Método não permitido.')
}