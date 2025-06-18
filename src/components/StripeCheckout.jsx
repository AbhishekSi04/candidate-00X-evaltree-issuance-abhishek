"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"

const StripeCheckout = ({ onPurchase, isIssued, price = 1, userId, title }) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleStripeCheckout = async () => {
    setIsLoading(true)

    try {
      // Check if Stripe is configured
      const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
      
      if (!stripeKey || stripeKey === 'pk_test_your_stripe_publishable_key_here') {
        // Demo mode - simulate checkout process
        // console.log('Demo mode: Simulating Stripe checkout...')
        
        // Simulate successful payment
        setTimeout(async () => {
          onPurchase()
          setIsLoading(false)
          
          // Small delay to ensure raffle ticket is added
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Navigate to success page with demo parameters
          navigate(`/success?session_id=demo_${Math.random().toString(36).substr(2, 9)}&userId=${userId}`)
        }, 2000)

        return
      }

      // Real Stripe integration
      const stripe = await loadStripe(stripeKey)

      // Create checkout session via server
      const response = await fetch('http://localhost:3001/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: price * 100, // Convert to cents
          userId: userId,
          isIssued: isIssued,
          title: title
        }),
      })

      const session = await response.json()

      if (session.error) {
        console.error('Error creating checkout session:', session.error)
        setIsLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        console.error('Error redirecting to checkout:', result.error)
        alert('Error redirecting to checkout. Please try again.')
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('Error during checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleStripeCheckout}
      disabled={isLoading}
      className={`w-full font-body font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black  text-white"
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

export default StripeCheckout 