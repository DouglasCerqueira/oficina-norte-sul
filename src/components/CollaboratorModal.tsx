import { useState } from 'react'
import { DEPARTMENTS, STATUSES } from '../types/collaborator'
import type { Collaborator, Department, Status } from '../types/collaborator'

interface CollaboratorModalProps {
  collaborator: Collaborator | null
  onClose: () => void
  onSave: (data: { name: string; department: Department; status: Status }) => Promise<void>
}

export function CollaboratorModal({ collaborator, onClose, onSave }: CollaboratorModalProps) {
  const [name, setName] = useState(collaborator?.name ?? '')
  const [department, setDepartment] = useState<Department>(collaborator?.department ?? DEPARTMENTS[0])
  const [status, setStatus] = useState<Status>(collaborator?.status ?? 'Ativo')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (name.trim().length === 0) {
      setError('Nome é obrigatório.')
      return
    }

    setSaving(true)
    try {
      await onSave({ name: name.trim(), department, status })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {collaborator ? 'Editar colaborador' : 'Novo colaborador'}
        </h2>

        {collaborator && collaborator.history.length > 0 && (
          <div className="mb-4 max-h-28 overflow-y-auto border border-slate-100 rounded-md p-2 bg-slate-50">
            <p className="text-xs font-medium text-slate-500 mb-1">Histórico</p>
            <ul className="text-xs text-slate-600 space-y-1">
              {[...collaborator.history].reverse().map((h, i) => (
                <li key={i}>
                  <span className="text-slate-400">
                    {new Date(h.changedAt).toLocaleString('pt-BR')}
                  </span>{' '}
                  — {h.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-slate-600">
            Nome
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              autoFocus
            />
          </label>

          <label className="text-sm text-slate-600">
            Setor
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Situação
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-500 px-3 py-2 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-slate-800 text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-slate-700 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}