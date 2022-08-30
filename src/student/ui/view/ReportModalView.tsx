import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import ReportContainer from '../logic/ReportContainer';

interface ReportModalViewProps {
  modalOpen: boolean;
  onModalClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onAlertOpen: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export function ReportModalView({ modalOpen, onModalClose, onAlertOpen }: ReportModalViewProps) {
  return (
    <Modal size="large" open={modalOpen}>
      <Modal.Header>Report</Modal.Header>
      <ReportContainer />
      <Modal.Actions>
        <Button className="w190 d" onClick={onModalClose}>
          취소
        </Button>
        <Button className="w190 p" onClick={onAlertOpen}>
          등록
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
