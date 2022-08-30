import { useEffect } from 'react';
import { getRepresentativeNumberRdo } from 'sms/model/RepresentativeNumberRdo';
import { requestSmsMainNumberList } from 'sms/service/requestSmsMainNumberList';
import {
  getSmsMainNumberSearchBoxViewModel,
  useSmsMainNumberListLimit,
  useSmsMainNumberListPage,
} from 'sms/store/SmsMainNumberStore';

export function useRequestMainNumberList() {
  const page = useSmsMainNumberListPage();
  const limit = useSmsMainNumberListLimit();

  useEffect(() => {
    if (page === undefined || limit === undefined) {
      return;
    }
    const smsSearchBox = getSmsMainNumberSearchBoxViewModel();
    if (smsSearchBox === undefined) {
      return;
    }
    const offset = (page - 1) * limit;
    const sentSmsRdo = getRepresentativeNumberRdo(smsSearchBox, offset, limit);
    requestSmsMainNumberList(sentSmsRdo);
  }, [page, limit]);
}
