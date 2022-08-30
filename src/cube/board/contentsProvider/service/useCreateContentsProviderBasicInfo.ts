import * as React from 'react';
import { autorun } from 'mobx';

import { fileUtil, ValidationType } from '@nara.drama/depot';

import { LangSupport, langSupportCdo } from 'shared/components/Polyglot';

import ContentsProvider from '../model/ContentsProvider';
import ContentsProviderStore from '../mobx/ContentsProviderStore';
import {
  findContentsProvider,
  modifyContentsProvider,
  registerContentsProvider,
  removeContentsProvider,
} from '../api/ContentsProviderApi';
import ContentsProviderCdoModel from '../model/ContentsProviderCdoModel';

export function useCreateContentsProviderBasicInfo(): [
  ContentsProvider | undefined,
  (file: File, setFileName: any) => void,
  () => void,
  (name: string, value: any) => void,
  ContentsProviderCdoModel | undefined,
  (communityId: string, contentsProviderId: string) => void,
  () => void
  //(selectMenus: MenuViewModel[]) => any
] {
  const contentsProviderStore = ContentsProviderStore.instance;
  const [value, setValue] = React.useState<ContentsProvider | undefined>(contentsProviderStore.selected);
  const [contentsProviderCdo, setContentsProviderCdo] = React.useState<ContentsProviderCdoModel | undefined>(
    contentsProviderStore.selectedContentsProviderCdo
  );

  React.useEffect(() => {
    return autorun(() => {
      setValue({ ...contentsProviderStore.selected });
      setContentsProviderCdo({
        ...contentsProviderStore.selectedContentsProviderCdo,
      });
    });
  }, [contentsProviderStore]);

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
      changeContentsProviderCdoProps('thumbnailPath', data);
      // coursePlanService.changeCoursePlanProps('iconBox.baseUrl', data);
    };
    fileReader.readAsDataURL(file);
  }

  const changeContentsProviderCdoProps = React.useCallback((name: string, value: any) => {
    //value.length 체크를 위해 any 처리
    if (name === 'name' && value.length > 100) {
      return;
    }

    if (name === 'description' && value.length > 100) {
      return;
    }

    if (name === 'remark' && value.length > 1000) {
      return;
    }

    if (name === 'name' && value.length > 500) {
      return;
    }

    if (value === '전체') value = '';

    contentsProviderStore.setContentsProviderCdo(contentsProviderStore.selectedContentsProviderCdo, name, value);
  }, []);

  const saveContentsProvider = React.useCallback(() => {
    contentsProviderStore.setContentsProviderCdo(
      contentsProviderStore.selectedContentsProviderCdo,
      'langSupports',
      langSupportCdo(contentsProviderStore.selectedContentsProviderCdo.langSupports)
    );

    contentsProviderCdo?.id && contentsProviderCdo?.id !== ''
      ? modifyContentsProvider(contentsProviderCdo?.id, contentsProviderStore.selectedContentsProviderCdo).then(
          contentsProviderStore.clearContentsProviderCdo
        )
      : registerContentsProvider(contentsProviderStore.selectedContentsProviderCdo).then(
          contentsProviderStore.clearContentsProviderCdo
        );
  }, []);

  const deleteContentsProvider = React.useCallback(() => {
    if (contentsProviderCdo?.id && contentsProviderCdo?.id !== '') {
      removeContentsProvider(contentsProviderCdo?.id).then(contentsProviderStore.clearContentsProviderCdo);
    }
  }, []);

  const findContentsProviderById = React.useCallback((communityId: string, contentsProviderId: string) => {
    findContentsProvider(communityId, contentsProviderId).then((response) => {
      const next = <ContentsProviderCdoModel>response;
      const langSupports = next.langSupports.map((target) => new LangSupport(target));
      next.langSupports = langSupports;
      contentsProviderStore.selectContentsProviderCdo(next);
    });
  }, []);

  return [
    value,
    uploadFile,
    saveContentsProvider,
    changeContentsProviderCdoProps,
    contentsProviderCdo,
    findContentsProviderById,
    deleteContentsProvider,
  ];
}
