"use client"

import { useState } from "react"
import { redirect } from "react-router-dom"

const CreateCollectibleForm = ({ userId, onCollectibleCreated, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    editionCap: 50,
    price: 1.0,
    imageUrl: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/createCollectible', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: userId
        }),
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Collectible created:', data.collectible)
        onCollectibleCreated(data.collectible)
        onClose();
        
      } else {
        setError(data.error || 'Failed to create collectible')
      }
    } catch (error) {
      console.error('Error creating collectible:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-gray-900">
            Create Digital Collectible
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-body font-medium text-gray-700 mb-2">
              Collectible Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              placeholder="e.g., Digital Masterpiece #001"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-body font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              placeholder="Describe your digital collectible..."
            />
          </div>

          {/* Edition Cap */}
          <div>
            <label htmlFor="editionCap" className="block text-sm font-body font-medium text-gray-700 mb-2">
              Edition Cap *
            </label>
            <input
              type="number"
              id="editionCap"
              name="editionCap"
              value={formData.editionCap}
              onChange={handleInputChange}
              required
              min="1"
              max="10000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              placeholder="50"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum number of editions available</p>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-body font-medium text-gray-700 mb-2">
              Price (€) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              placeholder="1.00"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-body font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to use default placeholder</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-body font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-black/90 hover:bg-black/80 text-white hover:shadow-lg transform hover:scale-105"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Collectible"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateCollectibleForm 