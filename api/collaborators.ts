import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from './_lib/firebase'
import { jsonError } from './_lib/http'
import { requireEditor } from './_lib/session'
import { DEPARTMENTS, STATUSES } from '../src/types/collaborator'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const collection = db.collection('collaborators')

  if (req.method === 'GET') {
    const snapshot = await collection.orderBy('name').get()
    const collaborators = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return res.status(200).json(collaborators)
  }

  if (req.method === 'POST') {
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

    const now = new Date().toISOString()
    const docRef = await collection.add({
      name: name.trim().toUpperCase(),
      department,
      status,
      createdAt: now,
      updatedAt: now,
      history: [{ changedBy: 'demo', changedAt: now, description: 'Cadastro criado' }],
    })

    const created = await docRef.get()
    return res.status(201).json({ id: created.id, ...created.data() })
  }

  return jsonError(res, 405, 'Método não permitido.')
}