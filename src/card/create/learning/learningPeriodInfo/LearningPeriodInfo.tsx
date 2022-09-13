import React from 'react';
import { observer } from 'mobx-react';
import { FormTable } from '../../../../shared/components';
import { LearningPeriodRow } from './LearningPeriodRow';
import { ValidLearningDateRow } from './ValidLearningDateRow';
import StudentEnrollmentTypeRow from './StudentEnrollmentTypeRow';

interface props {
  readonly?: boolean;
}

export const LearningPeriodInfo = observer(({ readonly }: props) => {
  return (
    <FormTable title="과정 기본 정보">
      <StudentEnrollmentTypeRow readonly={readonly} />
      <LearningPeriodRow readonly={readonly} />
      {/* <ValidLearningDateRow readonly={readonly} /> */}
    </FormTable>
  );
});
