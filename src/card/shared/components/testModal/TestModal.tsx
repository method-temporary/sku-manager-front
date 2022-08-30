import React from 'react';
import { observer } from 'mobx-react';
import { Button, PaginationProps } from 'semantic-ui-react';

import { Pagination } from 'shared/ui';
import { DimmerLoader, Modal } from 'shared/components';

import { ExamPaperModel } from 'exam/model/ExamPaperModel';

import TestModalStore from './TestModal.store';
import { useFindExamPaper } from './TestModal.hook';

import TestModalHeader from './components/TestModalHeader';
import TestModalList from './components/TestModalList';

interface Props {
  examPapers: ExamPaperModel[];
  onCancel?: () => void;
  onOk?: (examPapers: ExamPaperModel[]) => void;
}

const TestModal = observer(({ examPapers, onCancel, onOk }: Props) => {
  //
  const { examPaperAdminRdo, offset, limit, setExamPaperAdminRdo, setOffset, setSelectedExamPapers, reset } =
    TestModalStore.instance;

  const { data: Exams, isLoading } = useFindExamPaper(examPaperAdminRdo);

  const onMount = () => {
    //
    reset();
    examPapers && setSelectedExamPapers(examPapers);
    setExamPaperAdminRdo();
  };

  const totalPages = () => {
    if (Exams === undefined) {
      return 0;
    }

    return Math.ceil(Exams.totalCount / limit);
  };

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    //
    const offset = data.activePage as number;
    setOffset(offset);
    setExamPaperAdminRdo();
  };

  const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    reset();
    onCancel && onCancel();
    close();
  };

  const onClickOk = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    const { selectedExamPapers } = TestModalStore.instance;

    onOk && onOk(selectedExamPapers);
    onClickCancel(_, close);
  };

  return (
    <Modal size="large" trigger={<Button type="button">Test 선택</Button>} onMount={onMount}>
      <TestModalHeader />
      <Modal.Content scrolling className="fit-layout">
        <DimmerLoader active={isLoading}>
          <TestModalList examPapers={Exams?.results || []} />
        </DimmerLoader>
        <Pagination offset={offset} totalPages={totalPages()} onPageChange={onPageChange} />
      </Modal.Content>
      <Modal.Actions>
        <Modal.CloseButton className="w190 d" onClickWithClose={onClickCancel}>
          Cancel
        </Modal.CloseButton>
        <Modal.CloseButton className="w190 p" onClickWithClose={onClickOk}>
          OK
        </Modal.CloseButton>
      </Modal.Actions>
    </Modal>
  );
});

export default TestModal;
