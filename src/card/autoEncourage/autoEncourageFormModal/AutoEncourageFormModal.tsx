import React, { useEffect } from 'react';
import { Button, Form, Modal, Table } from 'semantic-ui-react';
import { SubmitHandler, useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { observer } from 'mobx-react';
import { Target } from '_data/lecture/autoEncourage/model/Target';
import { EmailFormat } from '_data/lecture/autoEncourage/model/EmailFormat';
import { SmsFormat } from '_data/lecture/autoEncourage/model/SmsFormat';
import { EncourageTitleInput } from './components/EncourageTitleInput';
import { EncourageIsUsedRadio } from './components/EncourageIsUsedRadio';
import { EncourageScheduledDateSelectBox } from './components/EncourageScheduledDateSelectBox';
import { EncourageTargetOptions } from './components/EncourageTargetOptions';
import { EncourageSendMediaCheckBox } from './components/EncourageSendMediaCheckBox';
import { EncourageEmailForm } from './components/EncourageEmailForm';
import { EncourageSMSForm } from './components/EncourageSMSForm';
import { autoEncourageValidation } from './autoEncourageFormModal.validation';
import { getAutoEncourageSdo } from '../utiles';
import { useModifyAutoEncourage, useRegisterAutoEncourage } from '../historyTab/historyTab.hooks';
import AutoEncourageFormModalStore from './autoEncourageFormModal.store';
import { useFindAutoEncourageById } from './autoEncourageFormModal.hooks';
import dayjs from 'dayjs';
import HistoryTabStore from '../historyTab/historyTab.store';

export interface AutoEncourageForm {
  encourageId?: string;
  encourageIsUse: boolean;
  encourageTitle: string;
  scheduledSendTime?: number;
  round?: number;
  encourageTarget?: Target;
  sendMediaUseEmail?: boolean;
  sendMediaUseSMS?: boolean;
  emailFormat?: EmailFormat;
  smsFormat?: SmsFormat;
}

export const AutoEncourageFormModal = observer(() => {
  const {
    historyTabState: { autoEncourageId },
    setAutoEncourageId,
  } = HistoryTabStore.instance;
  const { isOpen, type, setIsOpenAutoEncourageFormModal } = AutoEncourageFormModalStore.instance;

  const { data: autoEncourage } = useFindAutoEncourageById(autoEncourageId);

  const { mutate: autoEncourageRegisterMutate } = useRegisterAutoEncourage();
  const { mutate: autoEncourageModifyMutate } = useModifyAutoEncourage(autoEncourageId);
  const methods = useForm<AutoEncourageForm>();

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    return setIsOpenAutoEncourageFormModal(false);
  }, [setIsOpenAutoEncourageFormModal]);

  useEffect(() => {
    if (autoEncourage) {
      setValue('encourageTitle', autoEncourage.title);
      setValue(
        'scheduledSendTime',
        autoEncourage.scheduledSendTime ||
          dayjs()
            .hour(dayjs().hour() + 1)
            .minute(0)
            .valueOf()
      );
      setValue('encourageIsUse', !!autoEncourage.scheduledSendTime && true);
      setValue('round', autoEncourage.round);
      setValue('encourageTarget.learningState', autoEncourage.target?.learningState);
      setValue('encourageTarget.reportNotPassed', autoEncourage.target?.reportNotPassed);
      setValue('encourageTarget.surveyNotPassed', autoEncourage.target?.surveyNotPassed);
      setValue('encourageTarget.testNotPassed', autoEncourage.target?.surveyNotPassed);
      setValue('sendMediaUseEmail', !!autoEncourage.emailFormat?.title && true);
      setValue('sendMediaUseSMS', !!autoEncourage.smsFormat?.smsContents && true);
      setValue('emailFormat.title', autoEncourage.emailFormat?.title);
      setValue('emailFormat.mailContents', autoEncourage.emailFormat?.mailContents);
      setValue('smsFormat.operatorName', autoEncourage.smsFormat?.operatorName);
      setValue('smsFormat.operatorPhone', autoEncourage.smsFormat?.operatorPhone);
      setValue('smsFormat.smsContents', autoEncourage.smsFormat?.smsContents || '');
    }
  }, [autoEncourage, setValue]);

  const onClose = () => {
    setIsOpenAutoEncourageFormModal(false);
    setAutoEncourageId('');
    reset();
  };

  const onSubmit: SubmitHandler<AutoEncourageForm> = (data) => {
    const autoEncourageSdo = getAutoEncourageSdo(data);
    if (type === 'register') {
      autoEncourageRegisterMutate(autoEncourageSdo);
    } else {
      autoEncourageModifyMutate(autoEncourageSdo);
    }
    onClose();
  };

  const onErrors = (errors: FieldErrors<AutoEncourageForm>) => {
    autoEncourageValidation(errors, type);
  };

  const modalTitle = type === 'register' ? '자동독려 신규 등록' : '자동 독려 수정';

  const wariningTextStyle: React.CSSProperties = {
    textAlign: 'left',
    display: 'inline-block',
    padding: 0,
    background: '#E1083130',
    color: '#E10831',
    fontWeight: 'bold',
  };

  return (
    <Modal size="large" open={isOpen} onClose={onClose}>
      <Modal.Header>{modalTitle}</Modal.Header>
      <Modal.Content scrolling>
        <p style={wariningTextStyle}>* 자동독려 내용 작성 후 정상 발송 여부 테스트를 권장합니다.</p>
        <FormProvider {...methods}>
          <Form id="autoencourage" onSubmit={handleSubmit(onSubmit, onErrors)}>
            <Table celled>
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>
              <Table.Body>
                <EncourageTitleInput />
                <EncourageIsUsedRadio />
                <EncourageScheduledDateSelectBox />
                <EncourageTargetOptions />
                <EncourageSendMediaCheckBox />
                <EncourageEmailForm />
                <EncourageSMSForm />
              </Table.Body>
            </Table>
          </Form>
        </FormProvider>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>취소</Button>
        <Button type="submit" form="autoencourage">
          확인
        </Button>
      </Modal.Actions>
    </Modal>
  );
});
