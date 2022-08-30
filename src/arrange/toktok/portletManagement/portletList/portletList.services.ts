import { useEffect } from 'react';
import moment from 'moment';
import { getWorkspaceById } from 'shared/hooks';

import { findAllToktokPortlet } from '_data/arrange/toktok/api/toktokApi';
import { ToktokPortletRdo } from '_data/arrange/toktok/model';

import { getToktokPortletRdo } from '../../shared/util';
import { getPortletSearchBox } from '../portletSerchBox/portletSearchBox.stores';
import {
  setPortletList,
  usePortletListLimit,
  usePortletListPage,
  getPortletList,
  getPortletListPage,
  getPortletListLimit,
} from './portletList.stores';

const MYSUNI_CINEROOM_ID = 'ne1-m2-c2';

export function useRequestPortletList() {
  const limit = usePortletListLimit();
  const page = usePortletListPage();

  useEffect(() => {
    const searchBox = getPortletSearchBox();
    if (limit === undefined || page === undefined || searchBox === undefined) {
      return;
    }
    const offset = (page - 1) * limit;
    const toktokPortletRdo = getToktokPortletRdo(searchBox, offset, limit);
    requestPortletList(toktokPortletRdo);
  }, [limit, page]);
}

export async function requestPortletList(toktokPortletRdo: ToktokPortletRdo) {
  const offsetList = await findAllToktokPortlet(toktokPortletRdo);
  if (offsetList === undefined) {
    return;
  }

  const listItems = offsetList.results.map((result) => {
    const cineroomNames = result.cinerooms
      .map((cineroomId) => {
        if (cineroomId === MYSUNI_CINEROOM_ID) {
          return 'toktok';
        }
        const workspace = getWorkspaceById(cineroomId);
        return workspace === undefined ? '' : workspace.name.ko;
      })
      .filter((cineroomName) => cineroomName !== '');

    return {
      id: result.id,
      title: result.title,
      cineroomNames: cineroomNames.join(', '),
      registrantName: result.registrantName,
      registeredTime: moment(result.registeredTime).format('YYYY-MM-DD'),
      displayStartDate: moment(result.startTime).format('YYYY-MM-DD'),
      displayEndDate: moment(result.endTime).format('YYYY-MM-DD'),
    };
  });
  setPortletList({
    totalCount: offsetList.totalCount,
    items: listItems,
  });
}

export function getPortletNo(index: number) {
  const portletList = getPortletList();
  const page = getPortletListPage();
  const limit = getPortletListLimit();
  if (portletList?.totalCount === undefined || page === undefined || limit === undefined) {
    return 1;
  }
  return portletList.totalCount - (page - 1) * limit - index;
}
