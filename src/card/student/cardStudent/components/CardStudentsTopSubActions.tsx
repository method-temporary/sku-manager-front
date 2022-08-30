import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { SubActions } from '../../../../shared/components';
import { SendSmsService } from '../../../../shared/present';
import { CardStudentCount } from './CardStudentCount';
import { CardStudentRoundSelect } from './CardStudentRoundSelect';
import { CardStudentLimitSelect } from './CardStudentLimitSelect';
import { CardStudentExcelUploadButton } from './CardStudentExcelUploadButton';
import { CardStudentSendEmailModal } from './CardStudentSendEmailModal';
import { CardStudentSendSMSModal } from './CardStudentSendSMSModal';
import { CardStudentDeleteButton } from './CardStudentDeleteButton';
import { CardStudentExcelDownButton } from './CardStudentExcelDownButton';
import { useFindCardById } from '../../../list/CardList.hook';
import { useParams } from 'react-router';

export const CardStudentsTopSubActions = observer(() => {
  //
  const params = useParams<{ cardId: string }>();

  const { data: card } = useFindCardById(params.cardId);

  useEffect(() => {
    /// sms 권한 체크
    const sendSmsService = SendSmsService.instance;
    sendSmsService.findMySmsSenderAllowed();
  }, []);

  return (
    <SubActions>
      <SubActions.Left>
        {card?.card.studentEnrollmentType === 'Enrollment' ? <CardStudentRoundSelect /> : null}
        <CardStudentCount />
      </SubActions.Left>
      <SubActions.Right>
        <CardStudentLimitSelect />
        <CardStudentExcelDownButton />
        <CardStudentExcelUploadButton />
        <CardStudentSendEmailModal />
        <CardStudentSendSMSModal />
        <CardStudentDeleteButton />
      </SubActions.Right>
    </SubActions>
  );
});
