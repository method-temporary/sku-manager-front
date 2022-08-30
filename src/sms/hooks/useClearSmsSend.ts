import { useEffect } from 'react';
import { setSmsSendFormViewModel } from 'sms/store/SmsSendFormStore';
import { initSmsSendFormViewModel } from 'sms/viewmodel/SmsSendFormViewModel';

export function useClearSmsSend() {
  useEffect(() => {
    setSmsSendFormViewModel(initSmsSendFormViewModel());
  }, []);
}
