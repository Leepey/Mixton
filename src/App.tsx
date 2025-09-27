// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => {
  return <AppRoutes />;
};

export default App;