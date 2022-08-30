import React from 'react';
import { observer } from 'mobx-react';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import { SelectType } from '../../../../shared/model';
import { alert, AlertModel, SendEmailModal } from '../../../../shared/components';
import CardStudentResultStore from '../CardStudentResult.store';
import { useFindCardStudentForAdminResult } from '../CardStudentResult.hook';
import { useFindCardById } from '../../../list/CardList.hook';
import { StudentWithUserIdentity } from '_data/lecture/students/model/sdo/StudentWithUserIdentity';
import { StudentQueryModel } from '../../../../student/model/StudentQueryModel';

export const CardStudentResultEmailModal = observer(() => {
  //
  const { cardStudentResultParams, selectedCardStudentIds } = CardStudentResultStore.instance;
  const { data: students } = useFindCardStudentForAdminResult(cardStudentResultParams);
  const { data: card } = useFindCardById(cardStudentResultParams.cardId);

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
      cardId={cardStudentResultParams.cardId}
      cubeName={(card && getPolyglotToAnyString(card.card.name)) || ''}
      type={SelectType.mailOptions[2].value}
      sendCount={students?.totalCount}
      tooltipText="학습자 선택없이 메일보내기 클릭시 검색된 전체 학습자가 수신자로 지정 됩니다"
      cardConfigType="studentInfo"
      studentQuery={StudentQueryModel.asStudentResult(cardStudentResultParams)}
    />
  );
});
