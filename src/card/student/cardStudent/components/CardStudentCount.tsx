import React from 'react';
import { observer } from 'mobx-react';
import { SubActions } from '../../../../shared/components';
import CardStudentStore from '../CardStudent.store';
import { useFindCardStudentForAdminStudent, useFindStudentCount } from '../CardStudent.hooks';

export const CardStudentCount = observer(() => {
  //
  const { cardStudentParams, cardStudentCountParams } = CardStudentStore.instance;

  const { data: students } = useFindCardStudentForAdminStudent(cardStudentParams);
  const { data: studentCount } = useFindStudentCount(cardStudentCountParams);

  // const { data: studentCount } = useFindStudentCount();

  return (
    // <SubActions.Count>
    <span>
      전체 <strong>{studentCount?.totalStudentCount}</strong>명 <span className="dash">|</span>
      수강 신청 <strong>{studentCount?.proposalStateCount.submittedCount}</strong>명 <span className="dash">|</span>
      승인 <strong>{studentCount?.proposalStateCount.approvedCount}</strong>명 <span className="dash">|</span>
      반려 <strong>{studentCount?.proposalStateCount.rejectedCount}</strong>명 <span className="dash">|</span>
      취소 <strong>{studentCount?.proposalStateCount.canceledCount}</strong>명 <span className="dash">|</span>
    </span>
    // </SubActions.Count>
  );
});
