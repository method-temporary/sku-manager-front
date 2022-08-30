import { useState, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';

import { NaOffsetElementList } from 'shared/model';
import { SharedService } from 'shared/present';
import { responseToNaOffsetElementList } from 'shared/helper';

import Member from '../model/Member';
import { MemberQueryModel } from '../model/MemberQueryModel';
import MemberStore from '../mobx/MemberStore';
import {
  findAllMemberByQuery,
  removeMembers,
  modifyMembers,
  companionMembers,
  modifyMemberType,
} from '../api/MemberApi';

type Value = NaOffsetElementList<Member>;
interface ChangeMemberQueryProps {
  (name: string, value: any): void;
}
interface SearchQuery {
  (): void;
}
interface ClearMemberQuery {
  (): void;
}

interface UpdateMembers {
  (communityId: string, memberIdList: (string | undefined)[], confirmType: string): void;
}

interface RejectMembers {
  (communityId: string, memberIdList: (string | undefined)[], confirmType: string): void;
}

interface UpdateMemberType {
  (communityId: string, memberIdList: (string | undefined)[], memberType: string): void;
}

export function clearMemberQuery() {
  MemberStore.instance.clearMemberQuery();
}

export function useMemberList(): [
  // Adv Props
  // NaOffsetElementList<Member>,
  // (name: string, value: any) => void,
  // () => void,
  // MemberQueryModel,
  // () => void,
  // SharedService,
  // (communityId: string, memberIdList: (string | undefined)[],
  // confirmType: string) => void
  // Master Props
  Value,
  ChangeMemberQueryProps,
  SearchQuery,
  MemberQueryModel,
  SharedService,
  UpdateMembers,
  RejectMembers,
  UpdateMemberType
] {
  const memberStore = MemberStore.instance;
  const sharedService = SharedService.instance;

  const [valule, setValue] = useState<NaOffsetElementList<Member>>(memberStore.memberList);

  const [query, setQuery] = useState<MemberQueryModel>(memberStore.selectedMemberQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...memberStore.memberList });
      setQuery({ ...memberStore.selectedMemberQuery });
    });
  }, [memberStore, memberStore.selectedMemberQuery.approved]);

  const clearMemberQuery = useCallback(() => {
    memberStore.clearMemberQuery();
  }, []);

  const requestFindAllMemberByQuery = useCallback((memberQueryModel: MemberQueryModel) => {
    if (sharedService) {
      if (memberQueryModel.page) {
        changeMemberQueryProps('offset', (memberQueryModel.page - 1) * memberQueryModel.limit);

        changeMemberQueryProps('pageIndex', (memberQueryModel.page - 1) * memberQueryModel.limit);
        sharedService.setPage('member', memberQueryModel.page);
      } else {
        sharedService.setPageMap('member', 0, memberQueryModel.limit);
      }
    }

    findAllMemberByQuery(MemberQueryModel.asMemberRdo(memberQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<Member>(response);
      next.limit = memberQueryModel.limit;
      next.offset = memberQueryModel.offset;
      sharedService.setCount('member', next.totalCount);
      memberStore.setMemberList(next);
    });
  }, []);

  const changeMemberQueryProps = useCallback((name: string, value: any) => {
    if (value === '전체') value = '';

    memberStore.setMemberQuery(memberStore.selectedMemberQuery, name, value);

    //if (name === 'approved') console.log('approved', value); // searchQuery();

    if (name === 'limit') {
      changeMemberQueryProps('pageIndex', 0);
      changeMemberQueryProps('page', 0);
      changeMemberQueryProps('offset', 0);
      searchQuery();
    }
  }, []);

  const searchQuery = useCallback(() => {
    memberStore.clearMemberCdo();
    requestFindAllMemberByQuery(memberStore.selectedMemberQuery);
  }, []);

  const updateMembers = useCallback(
    (communityId: string, memberIdList: (string | undefined)[], confirmType: string) => {
      confirmType === 'remove'
        ? removeMembers(communityId, memberIdList).then((response) => {
            searchQuery();
          })
        : modifyMembers(communityId, memberIdList).then((response) => {
            searchQuery();
          });
    },
    []
  );
  const rejectMembers = useCallback((communityId: string, memberIdList: (string | undefined)[], remark: string) => {
    companionMembers(communityId, memberIdList, remark).then((response) => {
      searchQuery();
    });
  }, []);

  const updateMemberType = useCallback(
    (communityId: string, memberIdList: (string | undefined)[], memberType: string) => {
      modifyMemberType(communityId, memberIdList, memberType).then((response) => {
        searchQuery();
      });
    },
    []
  );

  // Adv
  // return [valule, changeMemberQueryProps, searchQuery, query, clearMemberQuery, sharedService, updateMembers];

  // Master
  return [
    valule,
    changeMemberQueryProps,
    searchQuery,
    query,
    sharedService,
    updateMembers,
    rejectMembers,
    updateMemberType,
  ];
}
