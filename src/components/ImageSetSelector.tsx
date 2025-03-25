// src/components/ImageSetSelector.tsx
import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

interface Props {
  selectedSet: 'setA' | 'setB';
  onChange: (value: 'setA' | 'setB') => void;
}

const ImageSetSelector: React.FC<Props> = ({ selectedSet, onChange }) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">画像セットを選択</FormLabel>
      <RadioGroup
        row
        value={selectedSet}
        onChange={(e) => onChange(e.target.value as 'setA' | 'setB')}
      >
        <FormControlLabel value="setA" control={<Radio />} label="セットA" />
        <FormControlLabel value="setB" control={<Radio />} label="セットB" />
      </RadioGroup>
    </FormControl>
  );
};

export default ImageSetSelector;
