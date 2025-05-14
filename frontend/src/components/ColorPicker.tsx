import React from 'react';
import { Box, Paper } from '@mui/material';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  const colors = [
    '#ffffff', // white
    '#f28b82', // red
    '#fbbc04', // yellow
    '#fff475', // light yellow
    '#ccff90', // light green
    '#a7ffeb', // teal
    '#cbf0f8', // light blue
    '#aecbfa', // blue
    '#d7aefb', // purple
    '#fdcfe8', // pink
    '#e6c9a8', // brown
    '#e8eaed', // gray
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        maxWidth: 300,
        position: 'absolute',
        zIndex: 1,
      }}
    >
      {colors.map((color) => (
        <Box
          key={color}
          onClick={() => onColorChange(color)}
          sx={{
            width: 24,
            height: 24,
            backgroundColor: color,
            borderRadius: '50%',
            cursor: 'pointer',
            border: color === selectedColor ? '2px solid #000' : '1px solid #ccc',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        />
      ))}
    </Paper>
  );
};

export default ColorPicker; 