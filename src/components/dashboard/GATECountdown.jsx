import { useState, useEffect } from 'react'
import './GATECountdown.css'

function GATECountdown() {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [mins, setMins] = useState(0)

  useEffect(() => {
    const target = new Date('2027-02-15T00:00:00').getTime()
    const update = () => {
      const now = Date.now()
      const diff = target - now
      if (diff > 0) {
        setDays(Math.floor(diff / (1000 * 60 * 60 * 24)))
        setHours(Math.floor((diff / (1000 * 60 * 60)) % 24))
        setMins(Math.floor((diff / (1000 * 60)) % 60))
      }
    }
    update()
    const timer = setInterval(update, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="gate-countdown">
      <div className="countdown-header">
        <span className="countdown-label">GATE 2027 COUNTDOWN</span>
      </div>
      <div className="countdown-timer">
        <div className="time-block">
          <span className="time-num">{days}</span>
          <span className="time-unit">Days</span>
        </div>
        <span className="time-sep">:</span>
        <div className="time-block">
          <span className="time-num">{hours}</span>
          <span className="time-unit">Hours</span>
        </div>
        <span className="time-sep">:</span>
        <div className="time-block">
          <span className="time-num">{mins}</span>
          <span className="time-unit">Minutes</span>
        </div>
      </div>
      <p className="countdown-quote">"Believe in your preparation. Success follows effort."</p>
      <p className="countdown-sincere">BE SINCERE AS TIME</p>
      <div className="countdown-motto">
        <span>AIM BIG</span> • <span>START EARLY</span> • <span>STAY CONSISTENT</span> • <span>TRUST THE PROCESS</span>
      </div>
    </div>
  )
}

export default GATECountdown
