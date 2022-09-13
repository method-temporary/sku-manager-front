import React from 'react';
import { observer } from 'mobx-react';
import { SubActions } from '../../../../shared/components';
import { CardStudentResultCount } from './CardStudentResultCount';
import { CardStudentResultRoundSelect } from './CardStudentResultRoundSelect';
import { CardStudentResultLimitSelect } from './CardStudentResultLimitSeleect';
import { CardStudentResultExcelButton } from './CardStudentResultExcelButton';
import { CardStudentResultEmailModal } from './CardStudentResultEmailModal';
import { CardStudentResultPDFButton } from './CardStudentResultPDFButton';
import { useParams } from 'react-router';
import { useFindCardById } from '../../../list/CardList.hook';
import { Button } from 'semantic-ui-react';

export const CardStudentResultTopSubActions = observer(() => {
  //
  const params = useParams<{ cardId: string }>();

  const { data: card } = useFindCardById(params.cardId);
  return (
    <SubActions>
      <SubActions.Left>
        {card?.card.studentEnrollmentType === 'Enrollment' ? <CardStudentResultRoundSelect /> : null}
        <CardStudentResultCount />
      </SubActions.Left>
      <SubActions.Right>
        {/* <CardStudentResultEmailModal />
        <CardStudentResultPDFButton /> */}
        <Button>삭제</Button>
        <Button>샘플양식 다운로드</Button>
        <Button>엑셀업로드</Button>
        <CardStudentResultExcelButton />
        <CardStudentResultLimitSelect />
      </SubActions.Right>
    </SubActions>
  );
});
