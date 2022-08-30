import React from 'react';
import { Button, Modal, ModalProps } from 'semantic-ui-react';
import { SmsDetailContainer } from '../container/SmsDetailContainer';

interface SmsModalViewProps {
  isOpen: boolean;
  onModalClose: () => void;
}

export function SmsModalView({
  isOpen,
  onModalClose,
}: SmsModalViewProps) {
  return (
    <>
       <Modal
          className="base w1000 inner-scroll"
          open={isOpen}
          onClose={onModalClose}
        >
          <Modal.Header>SMS 발송 정보</Modal.Header>
          <Modal.Content>
            <SmsDetailContainer />
          </Modal.Content>
          <Modal.Actions>
            <Button className="w190 p" onClick={onModalClose}>
              확인
            </Button>
          </Modal.Actions>
      </Modal>
    </>
  );
}