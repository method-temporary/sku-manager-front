import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { useCopyAutoEncouragesByCardIds } from './AutoEncourageCopyModal.hook';
import AutoEncourageCopyModalStore from './autoEncourageCopyModal.store';
import { CopyAutoEncourageCdo } from '_data/lecture/autoEncourage/model/CopyAutoEncourageCdo';
import { CopyModalSearchBox } from './components/CopyModalSearchBox';
import { CopyModalTable } from './components/CopyModalTable';
import AutoEncourageStore from '../autoEncourage.store';

export const AutoEncourageCopyModal = observer(() => {
  const { selectedCardIds, AutoEncourageCopyModalStoreReset } = AutoEncourageCopyModalStore.instance;
  const { mutate: copyAutoEncourageByCardIdsMutate } = useCopyAutoEncouragesByCardIds();

  const [isOpen, setIsOpen] = useState(false);

  const onOpenAutoEncourageCopyModal = () => {
    setIsOpen(true);
  };

  const onCloseAutoEncourageCopyModal = () => {
    setIsOpen(false);
    AutoEncourageCopyModalStoreReset();
  };

  const onRequestAutoEncourageCopy = () => {
    const { cardId } = AutoEncourageStore.instance;

    const copyAutoEncourageCdo: CopyAutoEncourageCdo = {
      sourceCardIds: selectedCardIds,
      targetCardId: cardId,
    };

    copyAutoEncourageByCardIdsMutate(copyAutoEncourageCdo);
    onCloseAutoEncourageCopyModal();
  };

  return (
    <Modal
      size="large"
      trigger={<Button type="button">복사</Button>}
      open={isOpen}
      onOpen={onOpenAutoEncourageCopyModal}
      onClose={onCloseAutoEncourageCopyModal}
    >
      <Modal.Header>자동독려 복사</Modal.Header>
      <CopyModalSearchBox />
      <CopyModalTable />
      <Modal.Actions>
        <Button className="btn_close" onClick={onCloseAutoEncourageCopyModal}>
          닫기
        </Button>
        <Button className="btn_save" onClick={onRequestAutoEncourageCopy}>
          선택
        </Button>
      </Modal.Actions>
    </Modal>
  );
});
