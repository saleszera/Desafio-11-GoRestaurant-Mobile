import React, { useContext } from 'react';

import { ModalContext } from '../../contexts/ModalContext';
import { Container, FinishText, Icon, Modal } from './styles';

const FinishOrderModal: React.FC = () => {
  const { isModalOpen } = useContext(ModalContext);

  return (
    <Modal animationType="fade" transparent visible={isModalOpen}>
      <Container>
        <Icon name="thumbs-up" size={40} />
        <FinishText>Pedido confirmado!</FinishText>
      </Container>
    </Modal>
  );
};

export default FinishOrderModal;
