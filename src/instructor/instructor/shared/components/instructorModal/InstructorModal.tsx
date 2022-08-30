import React from 'react';
import { observer } from 'mobx-react';
import { Button, PaginationProps } from 'semantic-ui-react';

import { Pagination } from 'shared/ui';
import { DimmerLoader, Modal } from 'shared/components';

import InstructorModalStore from './InstructorModal.store';
import { useFindInstructors } from './InstructorModal.hook';

import InstructorModalHeader from './components/InstructorModalHeader';
import InstructorModalList from './components/InstructorModalList';
import { InstructorWithOptional } from './model/InstructorWithOptional';

interface Props {
  instructors: InstructorWithOptional[];
  onCancel?: () => void;
  onOk?: (instructors: InstructorWithOptional[]) => void;
}

const InstructorModal = observer(({ instructors, onCancel, onOk }: Props) => {
  //
  const {
    offset,
    limit,
    instructorSdo,
    setOffset,
    setSelectedInstructors,
    setInstructorSdo,
    setInstructorPageSdo,
    reset,
  } = InstructorModalStore.instance;

  const { data: Instructors, isLoading } = useFindInstructors(instructorSdo);

  const onMount = () => {
    //
    reset();
    setSelectedInstructors(instructors);
    setInstructorSdo();
  };

  const totalPages = () => {
    if (Instructors === undefined) {
      return 0;
    }

    return Math.ceil(Instructors.totalCount / limit);
  };

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    //
    const offset = data.activePage as number;
    setOffset(offset);
    setInstructorPageSdo();
  };

  const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    reset();
    onCancel && onCancel();
    close();
  };

  const onClickOk = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    const { selectedInstructors } = InstructorModalStore.instance;

    const result: InstructorWithOptional[] = [];

    selectedInstructors.forEach((selectedInstructor) => {
      //
      const instructor = instructors.find((prop) => prop.instructor.id === selectedInstructor.instructor.id);
      instructor ? result.push(instructor) : result.push(selectedInstructor);
    });
    onOk && onOk(result);
    onClickCancel(_, close);
  };

  return (
    <Modal trigger={<Button type="button">강사 선택</Button>} onMount={onMount}>
      <InstructorModalHeader />
      <Modal.Content scrolling className="fit-layout">
        <DimmerLoader active={isLoading}>
          <InstructorModalList instructors={Instructors?.results || []} />
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

export default InstructorModal;
