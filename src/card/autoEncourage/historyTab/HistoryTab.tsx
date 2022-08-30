import React, { useEffect } from 'react';
import { HistoryTabSearchBox } from './components/HistoryTabSearchBox';
import { HistoryTabTable } from './components/HistoryTabTable';
import { HistoryTableBottom } from './components/HistoryTabTableBottom';
import { HistoryTabTableTop } from './components/HistoryTabTableTop';
import { AutoEncourageFormModal } from '../autoEncourageFormModal/AutoEncourageFormModal';
import { AutoEncourageDetailModal } from '../autoEncourageDetailModal/AutoEncourageDetailModal';
import HistoryTabStore from './historyTab.store';

export function HistoryTab() {
  const { initHistoryTabState } = HistoryTabStore.instance;

  useEffect(() => {
    return () => {
      initHistoryTabState();
    };
  }, [initHistoryTabState]);

  return (
    <>
      <HistoryTabSearchBox />
      <HistoryTabTableTop />
      <HistoryTabTable />
      <HistoryTableBottom />
      <AutoEncourageFormModal />
      <AutoEncourageDetailModal />
    </>
  );
}
