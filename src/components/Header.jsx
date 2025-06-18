"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "./logo.png"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}

            <Link to="/" className="flex items-center">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={logo} // replace with your image path
                  alt="Logo"
                  className="w-24 h-16 object-cover"
                />
              </div>
            </Link>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-200 font-body">
              Home
            </Link>
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-200 font-body">
              Marketplace
            </Link>
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-200 font-body">
              My Assets
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-200 font-body">
                Home
              </Link>
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-200 font-body">
                Marketplace
              </Link>
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-200 font-body">
                My Assets
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
