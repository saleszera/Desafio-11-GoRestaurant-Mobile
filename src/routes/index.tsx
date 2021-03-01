import React from 'react';

import { ModalProvider } from '../contexts/ModalContext';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  return (
    <ModalProvider>
      <AppRoutes />
    </ModalProvider>
  );
};

export default Routes;
