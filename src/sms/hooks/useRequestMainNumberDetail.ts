import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { requestSmsMainNumberDetail } from 'sms/service/requestSmsMainNumberDetail';
import { setSmsMainNumberCreateViewModel } from 'sms/store/SmsMainNumberStore';
import { initSmsMainNumberCreateViewModel } from 'sms/viewmodel/SmsMainNumberViewModel';

interface Params {
  mainNumberId: string;
}

export function useRequestMainNumberDetail() {
  const { mainNumberId } = useParams<Params>();
  useEffect(() => {
    if (mainNumberId === undefined) {
      setSmsMainNumberCreateViewModel(initSmsMainNumberCreateViewModel());
    } else {
      requestSmsMainNumberDetail(mainNumberId);
    }
  }, [mainNumberId]);
}
