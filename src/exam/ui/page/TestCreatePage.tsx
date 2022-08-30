import React from 'react';
import { TestCreateContainer } from '../logic/TestCreateContainer';
import { TestPreviewModalContainer } from '../logic/TestPreviewModalContainer';

export function TestCreatePage() {
  return (
    <>
      <TestCreateContainer />
      <TestPreviewModalContainer />
    </>
  );
}
