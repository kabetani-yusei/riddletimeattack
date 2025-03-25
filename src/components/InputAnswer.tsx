// src/components/InputAnswer.tsx
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface Props {
  onSubmit: (answer: string) => void;
}

const InputAnswer: React.FC<Props> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    onSubmit(input.trim().toLowerCase());
    setInput('');
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        label="解答を入力"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        送信
      </Button>
    </Box>
  );
};

export default InputAnswer;
