import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { findByRepresentativeNumberRdo } from 'sms/api/representativeNumberApi';
import { RepresentativeNumberRdo } from 'sms/model/RepresentativeNumberRdo';
import { setSmsMainNumberListViewModel } from 'sms/store/SmsMainNumberStore';
import { SmsMainNumberListItemModel } from 'sms/viewmodel/SmsMainNumberViewModel';

export async function requestSmsMainNumberList(representativeNumberRdo: RepresentativeNumberRdo) {
  const offsetList = await findByRepresentativeNumberRdo(representativeNumberRdo);
  if (offsetList === undefined) {
    return;
  }

  const mainNumberList: SmsMainNumberListItemModel[] = offsetList.results.map((result) => {
    return {
      enabled: result.representativeNumber.enabled,
      id: result.representativeNumber.id,
      modifiedTime: result.representativeNumber.modifiedTime,
      modifier: result.representativeNumber.modifier,
      name: result.representativeNumber.name,
      phone: result.representativeNumber.phone,
      registeredTime: result.representativeNumber.registeredTime, //moment(result.time).format('YYYY-MM-DD hh:mm:ss')
      registrant: result.representativeNumber.registrant,
      registrantName: result.simpleUserIdentity ? getPolyglotToAnyString(result.simpleUserIdentity.name) : '-',
    };
  });

  setSmsMainNumberListViewModel({
    totalCount: offsetList.totalCount,
    results: mainNumberList,
  });
}
