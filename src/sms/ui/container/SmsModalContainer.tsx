import React from 'react';
import { onModalClose } from 'sms/event/smsModalEvent';
import { useSmsModalViewModel } from 'sms/store/SmsModalStore';
import { initSmsModalViewModel } from 'sms/viewmodel/SmsModalViewModel';
import { SmsModalView } from '../view/SmsModalView';

export function SmsModalContainer() {
  const smsModal = useSmsModalViewModel() || initSmsModalViewModel();
  return (
    <SmsModalView
      isOpen={smsModal.isOpen}
      onModalClose={onModalClose}
    />
  );
}