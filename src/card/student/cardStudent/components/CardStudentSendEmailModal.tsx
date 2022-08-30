import React from 'react';
import { observer } from 'mobx-react';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import { SelectType } from '../../../../shared/model';
import { alert, AlertModel, SendEmailModal } from '../../../../shared/components';
import CardStudentStore from '../CardStudent.store';
import { useFindCardStudentForAdminStudent } from '../CardStudent.hooks';
import { StudentQueryModel } from '../../../../student/model/StudentQueryModel';
import { useFindCardById } from '../../../list/CardList.hook';
import { StudentWithUserIdentity } from '_data/lecture/students/model/sdo/StudentWithUserIdentity';

export const CardStudentSendEmailModal = observer(() => {
  //
  const { cardStudentParams, selectedCardStudentIds } = CardStudentStore.instance;

  const { data: students } = useFindCardStudentForAdminStudent(cardStudentParams);
  const { data: card } = useFindCardById(cardStudentParams.cardId);

  const onClickEmailModal = (): boolean => {
    //
    if (students?.totalCount && students?.totalCount <= 0) {
      alert(AlertModel.getCustomAlert(false, '안내', '학습자가 없습니다', '확인'));
      return false;
    }
    return true;
  };

  const getSelectedStudents = (): StudentWithUserIdentity[] => {
    //
    return (
      (students && students?.results.filter((student) => selectedCardStudentIds.includes(student.student.id))) || []
    );
  };

  return (
    <SendEmailModal
      onShow={onClickEmailModal}
      emailList={getSelectedStudents().map((students) => (students.userIdentity && students.userIdentity.email) || '-')}
      nameList={getSelectedStudents().map(
        (students) => (students.userIdentity && getPolyglotToAnyString(students.userIdentity.name)) || '-'
      )}
      idList={getSelectedStudents().map((students) => students.student.id)}
      cardId={cardStudentParams.cardId}
      cubeName={(card && getPolyglotToAnyString(card.card.name)) || ''}
      type={SelectType.mailOptions[2].value}
      sendCount={students?.totalCount}
      tooltipText="학습자 선택없이 메일보내기 클릭시 검색된 전체 학습자가 수신자로 지정 됩니다"
      cardConfigType="studentInfo"
      studentQuery={StudentQueryModel.asStudent(cardStudentParams)}
    />
  );
});
