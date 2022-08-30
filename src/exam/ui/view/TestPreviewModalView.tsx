import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { TestPreviewContainer } from '../logic/TestPreviewContainer';

interface TestPreviewModalViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestPreviewModalView({ isOpen, onClose }: TestPreviewModalViewProps) {
  return (
    <Modal open={isOpen}>
      <Modal.Header>미리보기</Modal.Header>
      <Modal.Content>
        <TestPreviewContainer />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>확인</Button>
      </Modal.Actions>
    </Modal>
  );
}
