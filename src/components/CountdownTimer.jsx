"use client"

import { useState, useEffect } from "react"

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-body text-gray-600 mr-2">⏰</span>
      <div className="flex space-x-1 text-sm font-body">
        <div className="bg-black text-white px-2 py-1 rounded text-xs">
          {String(timeLeft.hours).padStart(2, "0")}h
        </div>
        <div className="bg-black text-white px-2 py-1 rounded text-xs">
          {String(timeLeft.minutes).padStart(2, "0")}m
        </div>
        <div className="bg-black text-white px-2 py-1 rounded text-xs">
          {String(timeLeft.seconds).padStart(2, "0")}s
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer
