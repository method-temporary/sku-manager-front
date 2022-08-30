import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { PageTitle } from 'shared/components';
import { findUserInfo } from 'sms/event/smsListEvent';
import { onChangeFrom, onChangeMessage, onChangeTo, onClickList, onClickSendSms } from 'sms/event/smsSendFormEvent';
import { RepresentativeNumberRdo } from 'sms/model/RepresentativeNumberRdo';
import { requestSmsMainNumberList } from 'sms/service/requestSmsMainNumberList';
import { useSmsUserInfo } from 'sms/store/SmsListStore';
import { useSmsMainNumberListViewModel } from 'sms/store/SmsMainNumberStore';
import { useSmsSendFormViewModel } from 'sms/store/SmsSendFormStore';
import { SmsSendFormView } from '../view/SmsSendFormView';

export function SmsSendFormContainer() {
  useEffect(() => {
    const representativeNumberRdo: RepresentativeNumberRdo = {
      enabled: true,
      offset: 0,
      limit: 9999999,
    };
    requestSmsMainNumberList(representativeNumberRdo);
    findUserInfo().then((result) => {
      if (result !== undefined) {
        onChangeFrom(result.userPhone);
      }
    });
  }, []);

  const smsSendForm = useSmsSendFormViewModel();
  const smsMainNumbers = useSmsMainNumberListViewModel();
  const userInfo = useSmsUserInfo();

  return (
    <>
      <Container fluid>
        <PageTitle breadcrumb={breadcrumb} />
        {smsSendForm !== undefined && (
          <SmsSendFormView
            from={smsSendForm.from}
            to={smsSendForm.to}
            message={smsSendForm.message}
            mainNumbers={smsMainNumbers}
            userInfo={userInfo}
            onChangeFrom={onChangeFrom}
            onChangeTo={onChangeTo}
            onChangeMessage={onChangeMessage}
            onClickList={onClickList}
            onClickSendSms={onClickSendSms}
          />
        )}
      </Container>
    </>
  );
}

const breadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Sms', content: 'SMS 보내기', active: true },
];
