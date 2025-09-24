/*src/components/ui/typography/NeonText.tsx*/
import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

interface NeonTextProps extends TypographyProps {
  text: string;
}

const NeonText: React.FC<NeonTextProps> = ({ text, ...props }) => {
  return (
    <Typography
      {...props}
      sx={{
        background: 'linear-gradient(45deg, #00d4fe 30%, #4facfe 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        ...props.sx
      }}
    >
      {text}
    </Typography>
  );
};

export default NeonText;