import React, { useState, useEffect } from 'react';
import './FlipClock.css'; // Import your CSS file for styling

const FlipClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };

  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  return (
    <div className="flip-clock-container">
      <div className="flip-clock">
        {/* Hours */}
        <div className="digit">
          <div className="upper">
            <div className="card">
              <div className="flipper">
                <div className="front">{hours[0]}</div>
                <div className="back">{(parseInt(hours[0]) + 1) % 10}</div>
              </div>
            </div>
          </div>
          <div className="lower">
            <div className="card">
              <div className="flipper">
                <div className="front">{hours[1]}</div>
                <div className="back">{(parseInt(hours[1]) + 1) % 10}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Hours */}
        <div className="digit">
          <div className="upper">
            <div className="card">
              <div className="flipper">
                <div className="front">{minutes[0]}</div>
                <div className="back">{(parseInt(minutes[0]) + 1) % 10}</div>
              </div>
            </div>
          </div>
          <div className="lower">
            <div className="card">
              <div className="flipper">
                <div className="front">{minutes[1]}</div>
                <div className="back">{(parseInt(minutes[1]) + 1) % 10}</div>
              </div>
            </div>
          </div>
        </div>
         {/* Hours */}
         <div className="digit">
          <div className="upper">
            <div className="card">
              <div className="flipper">
                <div className="front">{seconds[0]}</div>
                <div className="back">{(parseInt(seconds[0]) + 1) % 10}</div>
              </div>
            </div>
          </div>
          <div className="lower">
            <div className="card">
              <div className="flipper">
                <div className="front">{seconds[1]}</div>
                <div className="back">{(parseInt(seconds[1]) + 1) % 10}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipClock;
