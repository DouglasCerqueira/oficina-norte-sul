import { useEffect, useMemo, useState } from 'react'
import { fetchCollaborators, createCollaborator, updateCollaborator } from '../services/collaborators'
import { CollaboratorModal } from '../components/CollaboratorModal'
import { Toast } from '../components/Toast'
import type { Collaborator, Status } from '../types/collaborator'
import type { Role } from '../types/session'

type StatusFilter = Status | 'Todos'

interface CollaboratorsPageProps {
  role: Role
  onLogout: () => void
}

export function CollaboratorsPage({ role, onLogout }: CollaboratorsPageProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Collaborator | null>(null)

  const [toast, setToast] = useState<{ message: string; collaborator: Collaborator } | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCollaborators()
      setCollaborators(data)
    } catch {
      setError('Não foi possível carregar a lista.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return collaborators.filter((c) => {
      const matchesSearch = term.length === 0 || c.name.toLowerCase().includes(term)
      const matchesStatus = statusFilter === 'Todos' || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [collaborators, search, statusFilter])

  async function handleToggleStatus(c: Collaborator) {
    const newStatus: Status = c.status === 'Ativo' ? 'Inativo' : 'Ativo'
    await updateCollaborator(c.id, { name: c.name, department: c.department, status: newStatus })
    await load()
    if (newStatus === 'Inativo') {
      setToast({ message: `${c.name} foi inativado.`, collaborator: c })
      setTimeout(() => setToast((t) => (t?.collaborator.id === c.id ? null : t)), 6000)
    }
  }

  async function handleUndo() {
    if (!toast) return
    await updateCollaborator(toast.collaborator.id, {
      name: toast.collaborator.name,
      department: toast.collaborator.department,
      status: 'Ativo',
    })
    await load()
    setToast(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Oficina Norte Sul</h1>
          <p className="text-xs text-slate-500">
            Perfil: {role === 'editor' ? 'Edição' : 'Só leitura'}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Sair
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm w-56"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="Todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {role === 'editor' && (
            <button
              className="bg-slate-800 text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-slate-700"
              onClick={() => { setEditing(null); setModalOpen(true) }}
            >
              Novo
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-slate-500">Carregando...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600 text-left">
                <tr>
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">Setor</th>
                  <th className="px-4 py-2">Situação</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className={`border-t border-slate-100 ${role === 'editor' ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                    onClick={() => {
                      if (role === 'editor') { setEditing(c); setModalOpen(true) }
                    }}
                  >
                    <td className="px-4 py-2 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-2 text-slate-600">{c.department}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            c.status === 'Ativo'
                              ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-medium'
                              : 'text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-xs font-medium'
                          }
                        >
                          {c.status}
                        </span>
                        {role === 'editor' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(c) }}
                            className="text-xs text-slate-400 hover:text-slate-700 underline"
                          >
                            {c.status === 'Ativo' ? 'Inativar' : 'Reativar'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                      Nenhum colaborador encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          actionLabel="Desfazer"
          onAction={handleUndo}
          onDismiss={() => setToast(null)}
        />
      )}

      {modalOpen && (
        <CollaboratorModal
          collaborator={editing}
          onClose={() => setModalOpen(false)}
          onSave={async (data) => {
            if (editing) {
              await updateCollaborator(editing.id, data)
            } else {
              await createCollaborator(data)
            }
            await load()
          }}
        />
      )}
    </div>
  )
}