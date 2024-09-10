import React, { useState, useEffect } from "react"

interface ClockProps {
  value: any
}

const Clock: React.FC<ClockProps> = ({ value }) => {
  const [time, setTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const secondsStyle = {
    transform: `rotate(${time.getSeconds() * 6}deg)`,
  }
  const minutesStyle = {
    transform: `rotate(${time.getMinutes() * 6}deg)`,
  }
  const hoursStyle = {
    transform: `rotate(${((time.getHours() % 12) + time.getMinutes() / 60) * 30}deg)`,
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 rounded-full border-4 border-gray-800 dark:border-gray-200">
        <div
          className="absolute top-1/2 left-1/2 w-1 h-16 -mt-16 -ml-0.5 bg-gray-800 dark:bg-gray-200 origin-bottom"
          style={hoursStyle}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-0.5 h-24 -mt-24 -ml-0.25 bg-gray-600 dark:bg-gray-400 origin-bottom"
          style={minutesStyle}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-0.5 h-32 -mt-32 -ml-0.25 bg-red-500 dark:bg-red-400 origin-bottom"
          style={secondsStyle}
        ></div>
      </div>
    </div>
  )
}

export default Clock
