import type { Collaborator, Department, Status } from '../types/collaborator'

export async function fetchCollaborators(): Promise<Collaborator[]> {
  const res = await fetch('/api/collaborators')
  if (!res.ok) throw new Error('Falha ao carregar colaboradores.')
  return res.json()
}

export async function createCollaborator(data: {
  name: string
  department: Department
  status: Status
}): Promise<Collaborator> {
  const res = await fetch('/api/collaborators', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Falha ao criar colaborador.')
  }
  return res.json()
}

export async function updateCollaborator(
  id: string,
  data: { name: string; department: Department; status: Status },
): Promise<Collaborator> {
  const res = await fetch(`/api/collaborators/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Falha ao editar colaborador.')
  }
  return res.json()
}