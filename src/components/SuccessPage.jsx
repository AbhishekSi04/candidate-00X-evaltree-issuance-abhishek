"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

const SuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState("")
  const [userId, setUserId] = useState("")
  const [enrollmentStatus, setEnrollmentStatus] = useState("")
  const [isEnrolling, setIsEnrolling] = useState(false)

  // Function to enroll user in the ecosystem
  const enrollUser = async (userId) => {
    if (!userId) return

    setIsEnrolling(true)
    try {
      const response = await fetch('https://candidate-00-x-evaltree-issuance-ab.vercel.app/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          platform: 'Evaltree'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setEnrollmentStatus('success')
        console.log('✅ User enrolled successfully:', data.message)
      } else {
        setEnrollmentStatus('error')
        console.error('❌ Enrollment failed:', data.error)
      }
    } catch (error) {
      setEnrollmentStatus('error')
      console.error('❌ Enrollment error:', error)
    } finally {
      setIsEnrolling(false)
    }
  }

  // Function to refresh raffle status
  const refreshRaffleStatus = async (userId) => {
    if (!userId) return
    
    try {
      const response = await fetch(`https://candidate-00-x-evaltree-issuance-ab.vercel.app/api/raffle-status?userId=${userId}`)
      const data = await response.json()
      console.log('🔄 Raffle status refreshed from success page:', data.ticketCount, 'tickets')
    } catch (error) {
      console.error('❌ Error refreshing raffle status:', error)
    }
  }

  // Function to increment user tickets
  const incrementUserTickets = async (userId) => {
    if (!userId) return
    
    try {
      const response = await fetch('https://candidate-00-x-evaltree-issuance-ab.vercel.app/api/increment-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()
      
      if (data.success) {
        // console.log('✅ Tickets incremented successfully:', data.message)
        console.log(`🎫 User ${userId}: ${data.previousTickets} → ${data.currentTickets} tickets`)
      } else {
        console.error('❌ Failed to increment tickets:', data.error)
      }
    } catch (error) {
      console.error('❌ Error incrementing tickets:', error)
    }
  }

  useEffect(() => {
    const session = searchParams.get("session_id")
    const user = searchParams.get("userId")
    
    if (session) setSessionId(session)
    if (user) setUserId(user)

    // Automatically enroll user when they land on success page
    if (user) {
      enrollUser(user)
      // Increment user tickets when success page is reached
      incrementUserTickets(user)
      // Also refresh raffle status to ensure it's up to date
      refreshRaffleStatus(user)
    }
  }, [searchParams])

  const handleContinueShopping = () => {
    // Refresh raffle status before navigating back
    if (userId) {
      refreshRaffleStatus(userId)
    }
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-neutral-light font-body flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your digital collectible has been issued and a raffle ticket has been added to your account.
          </p>

          {/* Enrollment Status */}
          {isEnrolling && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-700 text-sm">Enrolling you in the Evaltree ecosystem...</span>
              </div>
            </div>
          )}

          {enrollmentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700 text-sm">Welcome to the Evaltree ecosystem! 🎉</span>
              </div>
            </div>
          )}

          {enrollmentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-red-700 text-sm">Enrollment failed, but your purchase is complete</span>
              </div>
            </div>
          )}

          <div className="bg-accent/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Session ID:</strong> {sessionId || "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>User ID:</strong> {userId || "N/A"}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContinueShopping}
              className="w-full bg-primary hover:bg-primary/90 text-white font-body font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="w-full bg-accent-gold hover:bg-accent-gold/90 text-black font-body font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Check Raffle Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage 