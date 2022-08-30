import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';

import { findUsersByDenizenIds } from 'sms/api/senderApi';
import { findAllSentSms } from 'sms/api/sentSmsApi';
import { SentSmsRdo } from 'sms/model/SentSmsRdo';
import { setSmsListViewModel } from 'sms/store/SmsListStore';
import { SmsListItem } from 'sms/viewmodel/SmsListViewModel';

export async function requestSmsList(sentSmsRdo: SentSmsRdo) {
  const offsetList = await findAllSentSms(sentSmsRdo);
  if (offsetList === undefined) {
    return;
  }
  const ids: string[] = [];
  offsetList.results.map((result) => {
    if (result.patronKey !== null) {
      ids.push(result.patronKey.keyString);
    }
  });

  const senderInfos = await findUsersByDenizenIds(ids);

  const smsList: SmsListItem[] = offsetList.results.map((result) => {
    const senderInfo = senderInfos?.find(
      (userInfo: UserIdentityModel) => result.patronKey !== null && userInfo.id === result.patronKey.keyString
    );

    return {
      id: result.id,
      from: result.from,
      to: result.to.join(', '),
      message: result.message,
      sentDate: moment(result.time).format('YYYY-MM-DD HH:mm:ss'),
      senderEmail: senderInfo?.email || '',
      senderName: senderInfo === undefined ? '' : getPolyglotToAnyString(senderInfo.name),
    };
  });

  setSmsListViewModel({
    totalCount: offsetList.totalCount,
    smsList,
  });
}
