import React from 'react';
import { createContext, ReactNode, useState } from 'react';
import FinishOrderModal from '../components/FinishOrderModal';

interface ModalContextData {
  showModalandClose: () => void;
  isModalOpen: boolean;
}

interface ModalContextProps {
  children: ReactNode;
}

export const ModalContext = createContext({} as ModalContextData);

export function ModalProvider({ children, ...rest }: ModalContextProps): any {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function showModalandClose(): void {
    setIsModalOpen(true);

    setTimeout(() => {
      setIsModalOpen(false);
    }, 1000);
  }

  return (
    <ModalContext.Provider value={{ showModalandClose, isModalOpen }}>
      {children}
      {isModalOpen && <FinishOrderModal />}
    </ModalContext.Provider>
  );
}
