"use client"

import { useState } from "react"
import CountdownTimer from "./CountdownTimer"
import StripeCheckout from "./StripeCheckout"
import SuccessMessage from "./SuccessMessage"

const CollectibleCard = ({ 
  id, 
  title, 
  description,
  image, 
  available, 
  editionCap,
  price = 1, 
  onPurchase, 
  isIssued, 
  userId,
  createdAt,
  createdBy
}) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const targetDate = new Date().getTime() + (2 + id.length) * 60 * 60 * 1000 // Different times for each card

  const handlePurchase = () => {
    onPurchase(id)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 4000)
  }

  // Format creation date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Shorten user ID for display
  const shortenUserId = (userId) => {
    return userId ? `${userId.substring(0, 8)}...` : 'Unknown'
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${
        isIssued ? "animate-glow ring-2 ring-accent" : ""
      }`}
    >
      {/* Image placeholder */}
      <div className="h-64 bg-gradient-to-br from-primary to-accent-gold flex items-center justify-center relative overflow-hidden">
        {image ? (
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-white text-6xl opacity-50">🎨</div>
        )}

        {/* Limited Edition Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 text-primary px-3 py-1 rounded-full text-xs font-body font-semibold shadow-lg">
            Limited Edition
          </span>
        </div>

        {/* Unique ID Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-black/70 text-white px-2 py-1 rounded text-xs font-mono font-semibold shadow-lg">
            #{id.substring(id.length - 6)}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">{title}</h3>
        
        {description && (
          <p className="text-sm font-body text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Edition Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-body text-gray-600">
            <span className="font-semibold">{available}</span> of <span className="font-semibold">{editionCap}</span> Available
          </div>
          <span className="text-lg font-heading font-bold text-primary">€{price}</span>
        </div>

        {/* Creation Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Created: {formatDate(createdAt)}</span>
            <span>By: {shortenUserId(createdBy)}</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-body text-gray-600 mb-2">Time remaining:</p>
          <CountdownTimer targetDate={targetDate} />
        </div>

        {/* Purchase section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-body text-gray-500">+ 1 Raffle Ticket</span>
            <span className="text-xs font-body text-accent-gold font-semibold">🎟️ Bonus Included</span>
          </div>

          <StripeCheckout 
            onPurchase={handlePurchase} 
            isIssued={isIssued} 
            price={price} 
            userId={userId}
            title={title}
          />
        </div>

        <SuccessMessage show={showSuccess} onClose={() => setShowSuccess(false)} />
      </div>
    </div>
  )
}

export default CollectibleCard
