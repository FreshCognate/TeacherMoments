import React, { useState, useEffect, useRef } from "react";

const Timer = () => {
  const [time, setTime] = useState(0);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);

  const updateTimer = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = Math.floor((timestamp - startTimeRef.current) / 1000);
    setTime(elapsed);
    requestRef.current = requestAnimationFrame(updateTimer);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-9">
      {formatTime(time)}
    </div>
  );
};

export default Timer;