// src/components/ProviderTester.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

interface ProviderTesterProps {
  name: string;
  children: React.ReactNode;
}

const ProviderTester: React.FC<ProviderTesterProps> = ({ name, children }) => {
  console.log(`🧪 Testing provider: ${name}`);
  
  return (
    <Box sx={{ p: 2, border: '1px dashed red', m: 2 }}>
      <Typography variant="h6">Provider: {name}</Typography>
      {children}
    </Box>
  );
};

export default ProviderTester;