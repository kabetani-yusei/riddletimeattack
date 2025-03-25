// src/components/Countdown.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';

interface Props {
  onComplete: () => void;
  initialCount?: number;
}

const Countdown: React.FC<Props> = ({ onComplete, initialCount = 3 }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => setCount((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [count, onComplete]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
      <Typography variant="h3">{count}</Typography>
    </Box>
  );
};

export default Countdown;
