import { useState, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';

import { NaOffsetElementList } from 'shared/model';
import { SharedService } from 'shared/present';
import { responseToNaOffsetElementList } from 'shared/helper';

import Group from '../model/Group';
import { GroupQueryModel } from '../model/GroupQueryModel';
import GroupStore from '../mobx/GroupStore';
import { findAllGroupByQuery } from '../api/GroupApi';

export default interface GroupTemp {
  id?: number;
}

export function useGroupList(): [
  NaOffsetElementList<Group>,
  (name: string, value: string | number | Moment | undefined) => void,
  () => void,
  GroupQueryModel,
  () => void,
  SharedService
] {
  const groupStore = GroupStore.instance;
  const sharedService = SharedService.instance;

  const [valule, setValue] = useState<NaOffsetElementList<Group>>(groupStore.groupList);

  const [query, setQuery] = useState<GroupQueryModel>(groupStore.selectedGroupQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...groupStore.groupList });
      setQuery({ ...groupStore.selectedGroupQuery });
    });
  }, [groupStore]);

  const clearGroupQuery = useCallback(() => {
    groupStore.clearGroupQuery();
  }, []);

  const requestFindAllGroupByQuery = useCallback((groupQueryModel: GroupQueryModel) => {
    if (sharedService) {
      if (groupQueryModel.page) {
        changeGroupQueryProps('offset', (groupQueryModel.page - 1) * groupQueryModel.limit);
        changeGroupQueryProps('pageIndex', (groupQueryModel.page - 1) * groupQueryModel.limit);
        sharedService.setPage('group', groupQueryModel.page);
      } else {
        sharedService.setPageMap('group', 0, groupQueryModel.limit);
      }
    }

    findAllGroupByQuery(GroupQueryModel.asGroupRdo(groupQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<Group>(response);
      //sharedService.setState({ pageIndex: (page - 1) * 20 });
      next.limit = groupQueryModel.limit;
      next.offset = groupQueryModel.offset;
      sharedService.setCount('group', next.totalCount);
      groupStore.setGroupList(next);
    });
  }, []);

  const changeGroupQueryProps = useCallback((name: string, value: string | Moment | number | undefined) => {
    if (value === '전체') value = '';

    groupStore.setGroupQuery(groupStore.selectedGroupQuery, name, value);

    if (name === 'limit') {
      changeGroupQueryProps('pageIndex', 0);
      changeGroupQueryProps('page', 0);
      changeGroupQueryProps('offset', 0);
      searchQuery();
    }
  }, []);

  const searchQuery = useCallback(() => {
    groupStore.clearGroupCdo();
    requestFindAllGroupByQuery(groupStore.selectedGroupQuery);
  }, []);

  return [valule, changeGroupQueryProps, searchQuery, query, clearGroupQuery, sharedService];
}
