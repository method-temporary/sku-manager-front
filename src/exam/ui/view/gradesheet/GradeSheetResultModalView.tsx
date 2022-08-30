import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { GradeSheetContainer } from 'exam/ui/logic/GradeSheetContainer';

interface GradeSheetResultModalViewProps {
  modalOpen: boolean;
  onModalClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function GradeSheetResultModalView({ modalOpen, onModalClose }: GradeSheetResultModalViewProps) {
  return (
    <Modal open={modalOpen} className="base w1000 inner-scroll test-modal">
      <GradeSheetContainer />
      <Modal.Actions>
        <Button className="w190 pop d" onClick={onModalClose}>
          확인
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
