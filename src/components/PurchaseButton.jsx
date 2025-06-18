"use client"

import { useState } from "react"

const PurchaseButton = ({ onPurchase, isIssued, price = 1 }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    // Simulate Stripe checkout process
    setTimeout(() => {
      onPurchase()
      setIsLoading(false)
    }, 1500)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full font-body bg-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
        isLoading ? "bg-black cursor-not-allowed" : "bg-black  text-white"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : (
        `${isIssued ? "Create Now" : "Buy Now"} - €${price}`
      )}
    </button>
  )
}

export default PurchaseButton
