import React, { useEffect, useState } from 'react';

const Countdown = ({
  value,
  onFinish
}) => {
  const [timeLeft, setTimeLeft] = useState(value);

  useEffect(() => {
    setTimeLeft(value);
  }, [value]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onFinish) onFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  return (
    <div className="flex w-16 justify-center border border-lm-2 dark:border-dm-2 bg-lm-1 dark:bg-dm-1 rounded-lg">
      {timeLeft}s
    </div>
  );
};

export default Countdown;