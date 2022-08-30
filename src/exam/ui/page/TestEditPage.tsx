import React from 'react';
import { TestEditContainer } from '../logic/TestEditContainer';
import { TestPreviewModalContainer } from '../logic/TestPreviewModalContainer';

export function TestEditPage() {
  return (
    <>
      <TestEditContainer />
      <TestPreviewModalContainer />
    </>
  );
}