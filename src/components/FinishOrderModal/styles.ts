import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Modal = styled.Modal`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.View`
  flex: 1;

  align-items: center;
  justify-content: center;

  opacity: 0.9;
  background: #000000;
`;

export const Icon = styled(FeatherIcon)`
  color: #39b100;
`;

export const FinishText = styled.Text`
  font-size: 24px;
  font-family: 'Poppins-Regular';

  color: #fff;
  line-height: 28px;

  margin-top: 27px;
`;
