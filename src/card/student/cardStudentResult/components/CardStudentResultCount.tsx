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
      <strong style={{ color: 'black' }}>{students?.totalCount}</strong> 건 {'\u00a0\u00a0\u00a0\u00a0'} 이수
      <strong style={{ color: 'blue' }}>{studentCount?.learningStateCount.passedCount}</strong> 건{' '}
      {'\u00a0\u00a0\u00a0\u00a0'} 미이수
      <strong color="red">{studentCount?.learningStateCount.missedCount}</strong> 건
    </SubActions.Count>
  );
});
