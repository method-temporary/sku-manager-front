import { find } from 'sms/api/representativeNumberApi';
import { setSmsMainNumberCreateViewModel } from 'sms/store/SmsMainNumberStore';

export async function requestSmsMainNumberDetail(id: string) {
  const detail = await find(id);
  if (detail === undefined) {
    return;
  }
  setSmsMainNumberCreateViewModel({
    enabled: detail.enabled,
    id: detail.id,
    mainNumber: detail.phone,
    mainNumberName: detail.name,
  });
}
