import React from 'react';
import { SendEmailFileModal } from 'shared/components/SendEmail';
import { onCloseModal } from './MailSendFileModal.events';
import { useMailSendFileModal } from './MailSendFileModal.stores';

export function MailSendFileModalContainer() {
  const mailSendFileModal = useMailSendFileModal();

  return (
    <>
      {mailSendFileModal?.isOpen === true && (
        <SendEmailFileModal onClose={onCloseModal} />
      )}
    </>
  );
}