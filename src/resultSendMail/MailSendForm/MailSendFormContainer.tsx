import React, { useEffect, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from 'semantic-ui-react';
import { mobxHelper, reactAlert } from '@nara.platform/accent';
import { useHistory, useParams } from 'react-router-dom';

import { Loader, PageTitle } from 'shared/components';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';
import { SendEmailService } from 'shared/present';

import { addStyleImg, sendEmailIsBlank, useClearMailSendForm } from './mailSendForm.services';
import {
  onChangeContent,
  onChangeSearchFilter,
  onChangeSenderEmail,
  onChangeSender,
  onChangeSenderName,
  onChangeSendType,
  onChangeTitle,
} from './mailSendForm.events';

import MailSendFormView from './MailSendFormView';
import { MailSendFileModalContainer } from 'resultSendMail/MailSendFileModal/MailSendFileModalContainer';
import { onOpenModal } from 'resultSendMail/MailSendFileModal/MailSendFileModal.events';

interface Params {
  cineroomId: string;
}

interface Props {
  sendEmailService?: SendEmailService;
  loaderService?: LoaderService;
}

function MailSendFormContainer({ sendEmailService, loaderService }: Props) {
  useClearMailSendForm();
  const history = useHistory();
  const params = useParams<Params>();
  const { sendEmails } = sendEmailService!;
  const { openLoader, closeLoader } = loaderService!;

  useEffect(() => {
    closeLoader(true, 'mailSender');
  }, []);

  const onClickList = useCallback(() => {
    history.push(`/cineroom/${params.cineroomId}/service-management/boards/result-mail`);
  }, [history, params.cineroomId]);

  const onClickSend = useCallback(async () => {
    const sendEmailService = SendEmailService.instance;

    const blankField = sendEmailIsBlank(sendEmails);
    const alertMessage = '"' + blankField + '" 은 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
    if (blankField !== 'success') {
      reactAlert({
        title: '필수 정보 입력 안내',
        message: alertMessage,
      });
      return;
    }

    openLoader(true);
    sendEmailService.changeSendMailProps('mailContents', addStyleImg(sendEmails.mailContents));

    await sendEmailService.sendEmail();
    closeLoader(true, 'mailSender');

    reactAlert({
      title: '알림',
      message: '발송 요청 완료하였습니다.<br />수신자가 많을 경우 처리에 시간이 오래 소요될 수 있습니다.',
      onClose: onClickList,
    });
  }, []);

  return (
    <>
      <Container fluid>
        <Loader name="mailSender">
          <PageTitle breadcrumb={breadcrumb} />
          <MailSendFormView
            sendEmails={sendEmails}
            onChangeTitle={onChangeTitle}
            onChangeContent={onChangeContent}
            onChangeSendType={onChangeSendType}
            onChangeSearchFilter={onChangeSearchFilter}
            onChangeSenderName={onChangeSenderName}
            onChangeSenderEmail={onChangeSenderEmail}
            onChangeSender={onChangeSender}
            onClickExcelUpload={onOpenModal}
            onClickSend={onClickSend}
            onClickList={onClickList}
          />
        </Loader>
      </Container>
      <MailSendFileModalContainer />
    </>
  );
}

export default inject(mobxHelper.injectFrom('sendEmailService', 'loaderService'))(observer(MailSendFormContainer));

const breadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Mail', content: '메일 발송 결과 관리', active: true },
];
