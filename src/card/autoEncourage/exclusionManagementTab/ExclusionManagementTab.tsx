import React from 'react';
import { ExclusionSearchBox } from './components/ExclusionSearchBox';
import { ExclusionTable } from './components/ExclusionTable';
import { ExclusionTableBottom } from './components/ExclusionTableBottom';
import { ExclusionTableTop } from './components/ExclustionTableTop';

export function ExclusionManagementTab() {
  return (
    <>
      <ExclusionSearchBox />
      <ExclusionTableTop />
      <ExclusionTable />
      <ExclusionTableBottom />
    </>
  );
}
