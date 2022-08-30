import React from 'react';
import { Container } from 'semantic-ui-react';
import { TestCreateFormContainer } from './TestCreateFormContainer';
import { useRequestTestEdit } from '../../hooks/useRequestTestEdit';

export function TestEditContainer() {
  useRequestTestEdit();

  return (
    <>
      <Container fluid>
        <TestCreateFormContainer />
      </Container>
    </>
  );
}
