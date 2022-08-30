import { createStore } from 'shared/store';
import { MailSendFileModal } from './MailSendFileModal.models';

export const [setMailSendFileModal, onMailSendFileModal, getMailSendFileModal, useMailSendFileModal] =
  createStore<MailSendFileModal>({
    isOpen: false,
  });
