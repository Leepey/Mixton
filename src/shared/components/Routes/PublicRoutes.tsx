// src/shared/components/Routes/PublicRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../../../pages/Home';
import { About } from '../../../pages/About';
import { NotFound } from '../../../pages/NotFound';
import { ServerError } from '../../../pages/ServerError';
import { Unauthorized } from '../../../pages/Unauthorized';

export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/server-error" element={<ServerError />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
