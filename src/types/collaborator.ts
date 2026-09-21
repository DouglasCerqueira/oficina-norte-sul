export const DEPARTMENTS = ['Mecânica', 'Elétrica', 'Administrativo', 'Atendimento'] as const
export const STATUSES = ['Ativo', 'Inativo'] as const

export type Department = (typeof DEPARTMENTS)[number]
export type Status = (typeof STATUSES)[number]

export interface HistoryEntry {
  changedBy: string
  changedAt: string
  description: string
}

export interface Collaborator {
  id: string
  name: string
  department: Department
  status: Status
  createdAt: string
  updatedAt: string
  history: HistoryEntry[]
}