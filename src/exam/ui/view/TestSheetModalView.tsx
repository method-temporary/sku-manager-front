import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { LectureTestSheetContainer } from '../logic/LectureTestSheetContainer';

export interface TestSheetModalViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestSheetModalView({ isOpen, onClose }: TestSheetModalViewProps) {
  return (
    <Modal className="test-detail" size="large" open={isOpen}>
      <Modal.Header>시험지 상세보기</Modal.Header>
      <Modal.Content scrolling>
        <LectureTestSheetContainer />
      </Modal.Content>
      <Modal.Actions>
        <Button className="w190 d" onClick={onClose}>
          닫기
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
