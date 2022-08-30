import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { GradeSheetContainer } from 'exam/ui/logic/GradeSheetContainer';

interface GradeSheetModalViewProps {
  modalOpen: boolean;
  onModalClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onAlertOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function GradeSheetModalView({ modalOpen, onModalClose, onAlertOpen }: GradeSheetModalViewProps) {
  return (
    <Modal open={modalOpen} className="base w1000 inner-scroll test-modal">
      <GradeSheetContainer />
      <Modal.Actions>
        <Button className="w190 d" onClick={onModalClose}>
          취소
        </Button>
        <Button className="w190 p" onClick={onAlertOpen}>
          완료
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
