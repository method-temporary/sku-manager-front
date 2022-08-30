import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Container, Modal, Tab, TabProps } from 'semantic-ui-react';
import { DetailModalSendTargetTab } from './components/DetailModalSendTargetTab';
import { DetailModalHistoryTab } from './components/DetailModalHistoryTab';
import AutoEncourageDetailModalStore from './autoEncourageDetailModal.store';
import './autoEncourageDetailModal.css';

export const AutoEncourageDetailModal = observer(() => {
  const { isOpen, activeIndex, setIsOpen, setActiveIndex } = AutoEncourageDetailModalStore.instance;

  const isCloseAutoEncourageDetailModal = () => {
    setIsOpen(false);
  };

  const onChangeTab = (_: React.MouseEvent, { activeIndex }: TabProps) => {
    setActiveIndex(activeIndex as number);
  };

  return (
    <Container fluid>
      <Modal size="large" open={isOpen} onClose={isCloseAutoEncourageDetailModal}>
        <Modal.Header>자동독려</Modal.Header>
        <Modal.Content>
          <Tab
            panes={[
              { menuItem: '독려내역', render: () => <DetailModalHistoryTab /> },
              { menuItem: '발송대상 관리', render: () => <DetailModalSendTargetTab /> },
            ]}
            activeIndex={activeIndex}
            onTabChange={onChangeTab}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={isCloseAutoEncourageDetailModal} type="button">
            확인
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
});
