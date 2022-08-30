import * as React from 'react';
import { autorun } from 'mobx';

import { fileUtil } from '@nara.drama/depot';

import { AccessRuleService } from 'shared/present';
import { GroupBasedAccessRuleModel, GroupBasedAccessRule } from 'shared/model';

import { UserGroupService } from '../../../usergroup';
import Community from '../model/Community';
import CommunityStore from '../mobx/CommunityStore';
import {
  removeCommunity,
  findCommunityByName,
  registerCommunityAndMember,
  modifyCommunityAndMember,
  findCommunityAdmin,
} from '../api/CommunityApi';
import CommunityCdoModel from '../model/CommunityCdoModel';

export function useCreateCommunityBasicInfo(): [
  Community | undefined,
  (file: File, setFileName: any) => void,
  () => void,
  () => void,
  (name: string, value: any) => void,
  CommunityCdoModel | undefined,
  (communityId: string) => void,
  () => Promise<boolean>,
  () => boolean
] {
  const communityStore = CommunityStore.instance;
  const accessRuleService = AccessRuleService.instance;
  const userGroupService = UserGroupService.instance;

  const [value, setValue] = React.useState<Community | undefined>(communityStore.selected);
  const [communityCdo, setCommunityCdo] = React.useState<CommunityCdoModel | undefined>(
    communityStore.selectedCommunityCdo
  );
  // const [checkName, setCheckName] = React.useState<boolean>(
  //   communityStore.selectedCheckName
  // );

  React.useEffect(() => {
    return autorun(() => {
      setValue({ ...communityStore.selected });
      setCommunityCdo({ ...communityStore.selectedCommunityCdo });
      // setCheckName;
    });
  }, [communityStore]);

  const EXTENSION = {
    IMAGE: 'jpg|png|jpeg|PNG|JPG|JPEG',
  };

  function validatedAll(file: File) {
    const validations = [
      { type: 'Extension', validValue: EXTENSION.IMAGE },
      //{ type: ValidationType.MaxSize },
    ] as any[];
    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          // console.warn('validations의 type과 validValue값을 넣어주시거나 validator를 사용해주세요.'); TODO: default size 제한 없음
          return false;
        }
        return !fileUtil.validate(file, [], validation.type, validation.validValue);
      }
    });

    return !hasNonPass;
  }

  function uploadFile(file: File, setFileName: any) {
    //
    if (!file || (file instanceof File && !validatedAll(file))) {
      return;
    }

    if (file.size >= 1024 * 1024 * 0.3) {
      alert('300KB 이하만 업로드 가능합니다.');
      return;
    }
    setFileName(file.name);
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      //event = on_file_select
      const data = e.target.result;
      changeCommunityCdoProps('thumbnailId', data);
      // coursePlanService.changeCoursePlanProps('iconBox.baseUrl', data);
    };
    fileReader.readAsDataURL(file);
  }

  const changeCommunityCdoProps = React.useCallback((name: string, value: any) => {
    //value.length 체크를 위해 any 처리
    if (name === 'name' && value.length > 100) {
      return;
    }

    if (name === 'description' && value.length > 100) {
      return;
    }

    if (value === '전체') value = '';

    communityStore.setCommunityCdo(communityStore.selectedCommunityCdo, name, value);
  }, []);

  const saveCommunity = React.useCallback(async () => {
    //
    changeCommunityCdoProps(
      'groupBasedAccessRule',
      GroupBasedAccessRuleModel.asGroupBasedAccessRule(accessRuleService.groupBasedAccessRule)
    );

    communityCdo?.communityId && communityCdo?.communityId !== ''
      ? await modifyCommunityAndMember(
          communityCdo?.communityId,
          communityStore.selectedCommunityCdo,
          communityStore.selectedCommunityCdo.managerId
        ).then(communityStore.clearCommunityCdo)
      : await registerCommunityAndMember(
          communityStore.selectedCommunityCdo,
          communityStore.selectedCommunityCdo.managerId
        ).then(communityStore.clearCommunityCdo);
  }, [communityCdo]);

  const deleteCommunity = React.useCallback(() => {
    if (communityCdo?.communityId && communityCdo?.communityId !== '') {
      removeCommunity(communityCdo?.communityId).then(communityStore.clearCommunityCdo);
    }
  }, [communityCdo]);

  const findCommunityById = React.useCallback(async (communityId: string) => {
    await userGroupService.findUserGroupMap();

    findCommunityAdmin(communityId).then((response) => {
      const next = <CommunityCdoModel>response;
      communityStore.selectComunityCdo(next);

      accessRuleService.setGroupBasedAccessRule(
        GroupBasedAccessRule.asGroupBasedAccessRuleModel(next.groupBasedAccessRule, userGroupService.userGroupMap)
      );
    });
  }, []);

  const checkName = React.useCallback(() => {
    return findCommunityByName(encodeURI(communityStore.selectedCommunityCdo?.name)).then((response) => {
      //communityStore.setCheckName(response);
      //return communityStore.selectedCheckName;
      return response;
    });
    //return communityStore.selectedCheckName;
  }, []);

  const checkGroupBasedAccessRules = (): boolean => {
    //
    return accessRuleService.groupBasedAccessRule.accessRules.length > 0;
  };

  return [
    value,
    uploadFile,
    saveCommunity,
    deleteCommunity,
    changeCommunityCdoProps,
    communityCdo,
    findCommunityById,
    checkName,
    checkGroupBasedAccessRules,
  ];
}
