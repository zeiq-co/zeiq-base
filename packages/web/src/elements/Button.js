import React from 'react';
import styled from 'styled-components';

import { ThemeContext } from '../libs/ZeiqThemeProvider';

const Container = styled.button`
  color: ${(props) => props.color};
`;

const Button = () => {
  const theme = React.useContext(ThemeContext);

  return (
    <Container type="button" color={theme.primaryColor}>
      My Button
    </Container>
  );
};

export default Button;
