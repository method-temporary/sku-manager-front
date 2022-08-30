import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { findAllDistinctManagerIdentities, findAllSmsSendersAllowed, findUsersByDenizenIds } from 'sms/api/senderApi';
import { SenderRdo } from 'sms/model/SenderRdo';
import { setSmsSenderListViewModel } from 'sms/store/SmsSenderStore';
import { SmsSenderListItemModel } from 'sms/viewmodel/SmsSenderViewModel';
import { onChangePage } from 'sms/event/smsSenderEvent';

export async function requestSmsSenderList(senderRdo: SenderRdo) {
  const allSenderAllowedList = await findAllSmsSendersAllowed(senderRdo);

  let addMangerIds: string[] = [];
  if (senderRdo.qualified !== true) {
    const managerList = await findAllDistinctManagerIdentities(senderRdo);
    addMangerIds = managerList?.map((result) => result.citizenId) || [];
  }

  const senderList: SmsSenderListItemModel[] =
    allSenderAllowedList?.map((sender) => {
      addMangerIds = addMangerIds.filter((id) => id !== sender.smsSender.id);
      return {
        allowed: sender.smsSender.qualified,
        email: sender.user.email,
        companyName: sender.user.companyName,
        departmentName: sender.user.departmentName,
        id: sender.smsSender.id,
        name: getPolyglotToAnyString(sender.user.name),
        phone: sender.user.phone,
      };
    }) || [];

  const addMangerInfos = await findUsersByDenizenIds(addMangerIds);
  addMangerInfos?.map((manager) => {
    senderList.push({
      allowed: false,
      email: manager.email,
      companyName: manager.companyName,
      departmentName: manager.departmentName,
      id: manager.id,
      name: getPolyglotToAnyString(manager.name),
      phone: manager.phone,
    });
  });

  setSmsSenderListViewModel({
    totalCount: senderList.length,
    results: senderList.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name === b.name) return 0;
      if (a.name < b.name) return -1;
      return 0;
    }),
  });

  onChangePage();
}
