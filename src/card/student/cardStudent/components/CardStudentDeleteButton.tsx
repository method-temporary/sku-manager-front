import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import CardStudentStore from '../CardStudent.store';
import { confirm, ConfirmModel } from '../../../../shared/components';
import { useDeleteCardStudent, useFindCardStudentForAdminStudent } from '../CardStudent.hooks';
import CardStudentRemoveResultModal from '../../ui/logic/CardStudentRemoveResultModal';
import StudentDeleteResultModel from '../../../../student/model/StudentDeleteResultModel';

export const CardStudentDeleteButton = observer(() => {
  //
  const [resultText, setResultText] = useState('');
  const [isOpenRemoveStudentResultModal, setOpenRemoveStudentResultModal] = useState(false);
  const [joinCubeStudents, setJoinCubeStudents] = useState<StudentDeleteResultModel[]>([]);

  const { cardStudentParams, setCardStudentSelected, selectedCardStudentIds } = CardStudentStore.instance;

  const { mutateAsync: deleteCardStudentAsyncMutate } = useDeleteCardStudent();
  const { data: students } = useFindCardStudentForAdminStudent(cardStudentParams);

  const onClickDelete = () => {
    //
    const { selectedCardStudentIds } = CardStudentStore.instance;

    confirm(
      ConfirmModel.getRemoveConfirm(async () => {
        const responseStudents = await deleteCardStudentAsyncMutate(selectedCardStudentIds);
        const deletedCardStudents = responseStudents.filter((res) => res.removed);
        const failedCardStudents = responseStudents.filter((res) => !res.removed);
        const resultText = `총 ${selectedCardStudentIds.length}명 중 ${deletedCardStudents.length}명 삭제 성공 / ${failedCardStudents.length}명 삭제 실패`;

        setResultText(resultText);
        setOpenRemoveStudentResultModal(true);

        const failedIds = responseStudents.map((failed) => failed.id);
        const targetStudents: StudentDeleteResultModel[] =
          students?.results
            .filter(({ student }) => selectedCardStudentIds.includes(student.id))
            .filter(({ student }) => !failedIds.includes(student.id))
            .map(({ student }) => {
              return {
                id: student.id,
                cubeIds: [],
                removed: true,
                name: student.name,
              };
            }) || [];

        responseStudents.forEach((failedStudent) => {
          const targetStudent = students?.results.find((students) => students.student.id === failedStudent.id);
          targetStudents.push({ ...failedStudent, name: (targetStudent && targetStudent.student.name) || '' });
        });

        setJoinCubeStudents(targetStudents);

        setCardStudentSelected([]);
      }),
      true
    );
  };

  const onCloseModal = () => {
    //
    setOpenRemoveStudentResultModal(false);
  };

  // const getFailedStudents = (failedStudentIds: string[]): StudentDeleteResultModel[] => {
  //   //
  //
  // }

  return (
    <>
      <Button type="button" className="button" onClick={onClickDelete}>
        삭제
      </Button>
      <CardStudentRemoveResultModal
        open={isOpenRemoveStudentResultModal}
        text={resultText}
        failedStudentList={joinCubeStudents}
        onClosed={onCloseModal}
      />
    </>
  );
});
