import React from 'react';
import { TestManagementContainer } from "../logic/TestManagementContainer";
import { TestManagementModalContainer } from "../logic/TestManagementModalConatiner";

export function TestManagementPage() {
  return (
    <>
      <TestManagementContainer />
      <TestManagementModalContainer />
    </>
  );
}
