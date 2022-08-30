import { useState, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';

import { NaOffsetElementList, UserGroupRuleModel, GroupBasedAccessRule } from 'shared/model';
import { SharedService, AccessRuleService } from 'shared/present';
import { SearchBoxService } from 'shared/components/SearchBox';
import { responseToNaOffsetElementList } from 'shared/helper';

import { UserGroupService } from '../../../usergroup';
import Field from '../../field/model/Field';
import Community from '../model/Community';
import { CommunityQueryModel } from '../model/CommunityQueryModel';
import CommunityStore from '../mobx/CommunityStore';
import { findAllCommunityByQueryAdmin } from '../api/CommunityApi';

export default interface CommunityTemp {
  id?: number;
}

export function useCommunityList(): [
  NaOffsetElementList<Community>,
  (name: string, value: string | number | Moment | undefined) => void,
  () => void,
  CommunityQueryModel,
  () => void,
  (selectFields: Field[]) => any,
  SharedService,
  (accessRoles: UserGroupRuleModel[]) => void,
  () => void
] {
  const communityStore = CommunityStore.instance;
  const sharedService = SharedService.instance;
  const userGroupService = UserGroupService.instance;
  const accessRuleService = AccessRuleService.instance;
  const searchBoxService = SearchBoxService.instance;

  const [valule, setValue] = useState<NaOffsetElementList<Community>>(communityStore.communityList);

  const [query, setQuery] = useState<CommunityQueryModel>(communityStore.selectedCommunityQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...communityStore.communityList });
      setQuery({ ...communityStore.selectedCommunityQuery });
    });
  }, [communityStore]);

  const clearCommunityQuery = useCallback(() => {
    communityStore.clearCommunityQuery();
  }, []);

  const requestFindAllCommunityByQuery = useCallback((communityQueryModel: CommunityQueryModel) => {
    if (sharedService) {
      if (communityQueryModel.page) {
        changeCommunityQueryProps('offset', (communityQueryModel.page - 1) * communityQueryModel.limit);
        changeCommunityQueryProps('pageIndex', (communityQueryModel.page - 1) * communityQueryModel.limit);
        sharedService.setPage('community', communityQueryModel.page);
      } else {
        sharedService.setPageMap('community', 0, communityQueryModel.limit);
      }
    }

    findAllCommunityByQueryAdmin(CommunityQueryModel.asCommunityRdo(communityQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<Community>(response);
      //sharedService.setState({ pageIndex: (page - 1) * 20 });
      next.limit = communityQueryModel.limit;
      next.offset = communityQueryModel.offset;
      sharedService.setCount('community', next.totalCount);
      communityStore.setCommunityList(next);
    });
  }, []);

  const selectField = useCallback((selectFields: Field[]) => {
    const fieldSelect: any = [];
    if (selectFields) {
      fieldSelect.push({ key: 'All', text: '전체', value: '전체' });
      selectFields.map((field, index) => {
        fieldSelect.push({
          key: index + 1,
          text: field.title,
          value: field.id,
        });
      });
    }

    return fieldSelect;
  }, []);

  const changeCommunityQueryProps = useCallback((name: string, value: any) => {
    if (value === '전체') value = '';

    communityStore.setCommunityQuery(communityStore.selectedCommunityQuery, name, value);

    if (name === 'limit') {
      changeCommunityQueryProps('pageIndex', 0);
      changeCommunityQueryProps('page', 0);
      changeCommunityQueryProps('offset', 0);
      searchQuery();
    }
  }, []);

  const searchQuery = useCallback(async () => {
    communityStore.clearCommunityCdo();
    if (userGroupService.userGroupMap.size === 0) {
      await userGroupService.findUserGroupMap();
    }

    requestFindAllCommunityByQuery(communityStore.selectedCommunityQuery);
  }, []);

  const onSaveAccessRule = (accessRoles: UserGroupRuleModel[]): void => {
    //
    const accessRuleList = accessRoles.map((accessRole) => accessRole.seq);
    const ruleStrings = GroupBasedAccessRule.getRuleValueString(accessRoles);

    accessRuleService.clearGroupBasedAccessRule();
    accessRuleService.changeGroupBasedAccessRuleProp(
      `groupAccessRoles[${accessRuleService.groupBasedAccessRule.accessRules.length}].accessRoles`,
      accessRuleService.accessRules
    );

    changeCommunityQueryProps('groupBasedAccessRule', accessRuleList);
    changeCommunityQueryProps('ruleStrings', ruleStrings);
  };

  const clearGroupBasedRules = (): void => {
    //
    changeCommunityQueryProps('groupBasedAccessRule', []);
    changeCommunityQueryProps('ruleStrings', '');
  };

  return [
    valule,
    changeCommunityQueryProps,
    searchQuery,
    query,
    clearCommunityQuery,
    selectField,
    sharedService,
    onSaveAccessRule,
    clearGroupBasedRules,
  ];
}
