"use client"

import { useNavigate } from "react-router-dom"

const CancelPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-light font-body flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-primary hover:bg-primary/90 text-white font-body font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Return to Shopping
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-body font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Browse More Collectibles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CancelPage 