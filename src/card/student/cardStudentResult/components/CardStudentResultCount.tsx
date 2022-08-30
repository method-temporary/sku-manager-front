import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { SubActions } from '../../../../shared/components';
import CardStudentResultStore from '../CardStudentResult.store';
import { useFindCardStudentForAdminResult, useFindStudentCount } from '../CardStudentResult.hook';

export const CardStudentResultCount = observer(() => {
  //
  const { cardStudentResultParams, cardStudentCountParams } = CardStudentResultStore.instance;
  const { data: students } = useFindCardStudentForAdminResult(cardStudentResultParams);
  const { data: studentCount } = useFindStudentCount(cardStudentCountParams);

  return (
    <SubActions.Count>
      <strong>{students?.totalCount}</strong>명 | 결과처리대기
      <strong>{studentCount?.learningStateCount.resultWaitingCount}</strong>명<span className="dash">|</span>
      이수 <strong>{studentCount?.learningStateCount.passedCount}</strong>명 <span className="dash">|</span>
      미이수 <strong>{studentCount?.learningStateCount.missedCount}</strong>명 <span className="dash">|</span>
      불참 <strong>{studentCount?.learningStateCount.noShowCount}</strong>명
    </SubActions.Count>
  );
});
