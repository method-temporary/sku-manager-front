import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import ReportContainer from '../logic/ReportContainer';

interface ReportResultModalViewProps {
  modalOpen: boolean;
  onModalClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function ReportResultModalView({ modalOpen, onModalClose }: ReportResultModalViewProps) {
  return (
    <Modal size="large" open={modalOpen}>
      <Modal.Header>Report</Modal.Header>
      <ReportContainer />
      <Modal.Actions>
        <Button className="w190 d" onClick={onModalClose}>
          확인
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
