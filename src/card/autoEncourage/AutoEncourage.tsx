import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Tab } from 'semantic-ui-react';
import { HistoryTab } from './historyTab/HistoryTab';
import { ExclusionManagementTab } from './exclusionManagementTab/ExclusionManagementTab';
import AutoEncourageStore from './autoEncourage.store';

export const AutoEncourage = observer(() => {
  const { setCardId } = AutoEncourageStore.instance;

  const params = useParams<{ cardId: string }>();

  useEffect(() => {
    if (params.cardId !== '') {
      setCardId(params.cardId);
    }
  }, []);

  return (
    <Tab.Pane>
      <Tab
        panes={[
          { menuItem: '독려내역', render: () => <HistoryTab /> },
          { menuItem: '제외대상 관리', render: () => <ExclusionManagementTab /> },
        ]}
      />
    </Tab.Pane>
  );
});
