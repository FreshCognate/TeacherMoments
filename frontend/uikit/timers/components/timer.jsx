import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";

const Timer = ({ maxTime, onMaxTimeReached }) => {
  const [time, setTime] = useState(0);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasCalledMaxTimeRef = useRef(false);

  const updateTimer = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = Math.floor((timestamp - startTimeRef.current) / 1000);
    setTime(elapsed);

    if (maxTime && elapsed >= maxTime && !hasCalledMaxTimeRef.current) {
      hasCalledMaxTimeRef.current = true;
      if (onMaxTimeReached) onMaxTimeReached();
      return;
    }

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

  const isNearLimit = maxTime && time >= maxTime - 30;

  return (
    <div className={classnames("w-9", { "text-red-500": isNearLimit })}>
      {formatTime(time)}
    </div>
  );
};

export default Timer;