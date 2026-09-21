interface ToastProps {
  message: string
  actionLabel: string
  onAction: () => void
  onDismiss: () => void
}

export function Toast({ message, actionLabel, onAction, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded-md shadow-lg px-4 py-3 flex items-center gap-4 text-sm z-50">
      <span>{message}</span>
      <button
        onClick={onAction}
        className="text-emerald-300 font-medium hover:text-emerald-200"
      >
        {actionLabel}
      </button>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-200"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  )
}