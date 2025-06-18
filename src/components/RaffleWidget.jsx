"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"

const RaffleWidget = forwardRef(({ userId }, ref) => {
  const [ticketCount, setTicketCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch raffle status
  const fetchRaffleStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:3001/api/raffle-status?userId=${userId}`);
      // console.log("raffle widget is:",response);
      
      if (!response.ok) {
        throw new Error('Failed to fetch raffle status')
      }
      
      const data = await response.json()
      setTicketCount(data.ticketCount || 0)
      // console.log('✅ Raffle status updated:', data.ticketCount, 'tickets')
    } catch (err) {
      setError(err.message)
      console.error('Error fetching raffle status:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Expose refresh function to parent components
  useImperativeHandle(ref, () => ({
    refresh: fetchRaffleStatus
  }))

  // Trigger raffle award
  const triggerRaffleAward = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/raffle-award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to trigger raffle award')
      }

      const data = await response.json()
      
      // Refresh raffle status after award
      await fetchRaffleStatus()
      
      // Show success message
      alert(`Congratulations! You won: ${data.prize}`)
    } catch (err) {
      setError(err.message)
      console.error('Error triggering raffle award:', err)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchRaffleStatus()
    }
  }, [userId])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        fetchRaffleStatus()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [userId])

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-6 bg-white/20 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-md rounded-lg p-4 border border-red-500/20">
        <p className="text-red-400 text-sm">Error loading raffle status</p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-black/20">
      <h3 className="text-lg font-heading font-semibold text-black mb-2">
        🎰 Raffle Tickets
      </h3>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-black/80 text-sm">Your Tickets:</span>
        <span className="text-2xl font-bold text-black">{ticketCount/2}</span>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-black/60 mb-2">
          {ticketCount > 0 
            ? "You have tickets in the current raffle!" 
            : "Purchase to get raffle tickets!"
          }
        </div>
        
        {ticketCount > 0 && (
          <button
            onClick={triggerRaffleAward}
            className="w-full bg-black/90 hover:bg-black/60 text-white font-body font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            🎁 Claim Prize
          </button>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs text-white/50">
          Next draw: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
})

RaffleWidget.displayName = 'RaffleWidget'

export default RaffleWidget
