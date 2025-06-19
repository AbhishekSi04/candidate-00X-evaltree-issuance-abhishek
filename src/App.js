"use client"

import { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import CollectiblesGrid from "./components/CollectiblesGrid"
import RaffleWidget from "./components/RaffleWidget"
import SuccessPage from "./components/SuccessPage"
import CancelPage from "./components/CancelPage"

const EvaltreeExclusive = () => {
  const [userId, setUserId] = useState(null)
  const [issuedCards, setIssuedCards] = useState(new Set())
  const [showCollectibles, setShowCollectibles] = useState(false)
  const [collectibles, setCollectibles] = useState([])
  const [isLoadingCollectibles, setIsLoadingCollectibles] = useState(false)
  const raffleWidgetRef = useRef()

  // Generate or retrieve user ID on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('avaltree_user_id')
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('avaltree_user_id', newUserId)
      setUserId(newUserId)
    }
  }, [])

  // Fetch collectibles from API
  const fetchCollectibles = async () => {
    setIsLoadingCollectibles(true)
    try {
      const response = await fetch('https://candidate-00-x-evaltree-issuance-ab.vercel.app/api/collectibles')
      const data = await response.json()
      
      if (data.success) {
        setCollectibles(data.collectibles)
        console.log('✅ Fetched collectibles:', data.collectibles)
      } else {
        console.error('❌ Failed to fetch collectibles:', data.error)
      }
    } catch (error) {
      console.error('❌ Error fetching collectibles:', error)
    } finally {
      setIsLoadingCollectibles(false)
    }
  }

  // Handle showing collectibles
  const handleShowCollectibles = () => {
    if (!showCollectibles) {
      fetchCollectibles()
    }
    setShowCollectibles(true)
  }

  // Handle new collectible creation
  const handleCollectibleCreated = (newCollectible) => {
    setCollectibles(prev => [newCollectible, ...prev])
    setShowCollectibles(true) // Show collectibles after creation
  }

  const handlePurchase = async (cardId) => {
    setIssuedCards((prev) => new Set([...prev, cardId]))
    
    // Refresh raffle status after purchase
    if (raffleWidgetRef.current) {
      console.log('🔄 Refreshing raffle status after purchase...')
      await raffleWidgetRef.current.refresh()
    }
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-neutral-light font-body flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Main page component
  const MainPage = () => (
    <div className="min-h-screen bg-neutral-light font-body">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <Header />
      <HeroSection onShowCollectibles={handleShowCollectibles} userId={userId} />
      
      {/* Show Collectibles Grid only when requested */}
      {showCollectibles && (
        <CollectiblesGrid 
          collectibles={collectibles} 
          onPurchase={handlePurchase} 
          issuedCards={issuedCards}
          userId={userId}
          isLoading={isLoadingCollectibles}
          onCollectibleCreated={handleCollectibleCreated}
        />
      )}
      
      <Footer />
      
      {/* Persistent Raffle Widget */}
      <div className="fixed bottom-6 right-6 z-40 w-80">
        <RaffleWidget ref={raffleWidgetRef} userId={userId} />
      </div>
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default EvaltreeExclusive
