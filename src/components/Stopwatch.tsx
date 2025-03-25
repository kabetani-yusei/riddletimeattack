// src/components/Stopwatch.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';

interface Props {
  running: boolean;
  additionalTime?: number; // パス時の追加時間（ミリ秒）
  onTimeUpdate?: (elapsed: number) => void;
}

const Stopwatch: React.FC<Props> = ({ running, additionalTime = 0, onTimeUpdate }) => {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null); // 型を number に変更

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now() - elapsed;
      intervalRef.current = window.setInterval(() => {
        const newElapsed = Date.now() - (startTimeRef.current as number);
        setElapsed(newElapsed);
        if (onTimeUpdate) onTimeUpdate(newElapsed);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // 追加時間があれば反映する
  useEffect(() => {
    if (additionalTime > 0) {
      setElapsed((prev) => prev + additionalTime);
      if (startTimeRef.current) {
        startTimeRef.current = Date.now() - (elapsed + additionalTime);
      }
    }
  }, [additionalTime]);

  const formatTime = (ms: number) => {
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <Typography variant="h5">
      {formatTime(elapsed)}
    </Typography>
  );
};

export default Stopwatch;
