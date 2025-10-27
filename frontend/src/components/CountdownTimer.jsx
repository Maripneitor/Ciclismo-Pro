// frontend/src/components/CountdownTimer.jsx
import { useState, useEffect } from 'react';

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({});
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft.days && !timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
    return null;
  }

  return (
    <div className="countdown-timer">
      <span>Inicia en: </span>
      {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
      {timeLeft.hours > 0 && <span>{timeLeft.hours}h </span>}
      {timeLeft.minutes > 0 && <span>{timeLeft.minutes}m </span>}
      {timeLeft.seconds > 0 && <span>{timeLeft.seconds}s</span>}
    </div>
  );
}

export default CountdownTimer;