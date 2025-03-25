// src/components/FinalScreen.tsx
import React from 'react';
import { Typography, Button, Box } from '@mui/material';

interface Props {
  imageSetName: string;
  elapsedTime: number;
  onTweet: () => void;
}

const FinalScreen: React.FC<Props> = ({ imageSetName, elapsedTime, onTweet }) => {
  const formatTime = (ms: number) => {
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4">{imageSetName} の結果</Typography>
      <Typography variant="h5" mt={2}>
        タイム: {formatTime(elapsedTime)}
      </Typography>
      <Button variant="contained" color="primary" onClick={onTweet} sx={{ mt: 2 }}>
        Twitterでシェア
      </Button>
    </Box>
  );
};

export default FinalScreen;
