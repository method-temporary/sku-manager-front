import * as React from 'react';
import { autorun } from 'mobx';
import { fileUtil, ValidationType } from '@nara.drama/depot';
import Member from '../model/Member';
import MemberStore from '../mobx/MemberStore';
import { registerMember, findMember, modifyMember, removeMember } from '../api/MemberApi';
import MemberCdoModel from '../model/MemberCdoModel';

export function useCreateMemberBasicInfo(): [
  Member | undefined,
  (file: File, setFileName: any) => void,
  () => void,
  (name: string, value: any) => void,
  MemberCdoModel | undefined,
  (communityId: string, memberId: string) => void,
  () => void
] {
  const memberStore = MemberStore.instance;
  const [value, setValue] = React.useState<Member | undefined>(memberStore.selected);
  const [memberCdo, setMemberCdo] = React.useState<MemberCdoModel | undefined>(memberStore.selectedMemberCdo);

  React.useEffect(() => {
    return autorun(() => {
      setValue({ ...memberStore.selected });
      setMemberCdo({
        ...memberStore.selectedMemberCdo,
      });
    });
  }, [memberStore]);

  const EXTENSION = {
    IMAGE: 'jpg|png|jpeg',
  };

  function validatedAll(file: File) {
    const validations = [{ type: 'Extension', validValue: EXTENSION.IMAGE }, { type: ValidationType.MaxSize }] as any[];
    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          // console.warn('validations의 type과 validValue값을 넣어주시거나 validator를 사용해주세요.'); TODO: default size 제한 없음
          return false;
        }
        return !fileUtil.validate(file, validation.type, validation.validValue);
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
      changeMemberCdoProps('thumbnailId', data);
      // coursePlanService.changeCoursePlanProps('iconBox.baseUrl', data);
    };
    fileReader.readAsDataURL(file);
  }

  const changeMemberCdoProps = React.useCallback((name: string, value: any) => {
    //value.length 체크를 위해 any 처리
    if (name === 'name' && value.length > 100) {
      return;
    }

    if (name === 'description' && value.length > 100) {
      return;
    }

    if (value === '전체') value = '';

    memberStore.setMemberCdo(memberStore.selectedMemberCdo, name, value);
  }, []);

  const saveMember = React.useCallback(() => {
    memberCdo?.memberId && memberCdo?.memberId !== ''
      ? modifyMember(memberCdo?.memberId, memberStore.selectedMemberCdo).then(memberStore.clearMemberCdo)
      : registerMember(memberStore.selectedMemberCdo).then(memberStore.clearMemberCdo);
  }, [memberCdo]);

  const deleteMember = React.useCallback(() => {
    if (memberCdo?.memberId && memberCdo?.memberId !== '') {
      removeMember(memberCdo?.communityId, memberCdo?.memberId).then(memberStore.clearMemberCdo);
    }
  }, [memberCdo]);

  const findMemberById = React.useCallback((communityId: string, memberId: string) => {
    findMember(communityId, memberId).then((response) => {
      const next = <MemberCdoModel>response;
      memberStore.selectMemberCdo(next);
    });
  }, []);

  return [value, uploadFile, saveMember, changeMemberCdoProps, memberCdo, findMemberById, deleteMember];
}
