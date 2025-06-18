"use client"

import { useState } from "react"
import CreateCollectibleForm from "./CreateCollectibleForm"

const HeroSection = ({ onShowCollectibles, userId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleCreateCollectible = (newCollectible) => {
    // This will be handled by the parent component
    console.log('New collectible created:', newCollectible)
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-4 animate-fade-in">
            Evaltree Exclusive
          </h1>
          <p className="text-xl font-body text-gray-600 max-w-2xl mx-auto animate-fade-in mb-8">
            Discover rare, limited-edition digital art pieces. Each purchase includes a raffle ticket for exclusive
            rewards.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={onShowCollectibles}
              className="bg-black text-white font-body font-semibold py-3 px-8 rounded border border-white transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              🎨 Browse Collectibles
            </button>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-black hover:bg-black text-white font-body font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              ✨ Create Collectible
            </button>
          </div>

          {/* Featured stats */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="text-center">
              <p className="text-2xl font-heading font-bold text-primary">500+</p>
              <p className="text-sm font-body text-gray-600">Collectibles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-heading font-bold text-primary">10K+</p>
              <p className="text-sm font-body text-gray-600">Collectors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-heading font-bold text-primary">€2M+</p>
              <p className="text-sm font-body text-gray-600">Volume</p>
            </div>
          </div>
        </div>
      </section>

      {/* Create Collectible Form Modal */}
      {showCreateForm && (
        <CreateCollectibleForm
          userId={userId}
          onCollectibleCreated={handleCreateCollectible}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </>
  )
}

export default HeroSection
