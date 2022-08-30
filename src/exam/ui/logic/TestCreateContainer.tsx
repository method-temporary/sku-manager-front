import React from 'react';
import { Container } from 'semantic-ui-react';
import { TestCreateFormContainer } from './TestCreateFormContainer';

export function TestCreateContainer() {
  return (
    <>
      <Container fluid>
        <TestCreateFormContainer />
      </Container>
    </>
  );
}
