"use client"

const SuccessMessage = ({ show, onClose }) => {
  if (!show) return null

  return (
    <div className="mt-4 p-3 bg-accent/20 border border-accent rounded-lg animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-primary font-body text-sm">✅ Purchase successful! Raffle ticket added.</p>
        <button onClick={onClose} className="text-primary hover:text-primary/70 ml-2">
          ✕
        </button>
      </div>
    </div>
  )
}

export default SuccessMessage
