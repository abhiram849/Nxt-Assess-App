import React from 'react'
import './index.css'

const Timer = ({timeRemainingInSeconds}) => {
  const hours = Math.floor(timeRemainingInSeconds / 3600)
  const minutes = Math.floor((timeRemainingInSeconds % 3600) / 60)
  const seconds = timeRemainingInSeconds % 60

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="timer-container">
      <p className="timer-heading">Time Left</p>
      <p className="timer-display">{formattedTime}</p>
    </div>
  )
}

export default Timer
