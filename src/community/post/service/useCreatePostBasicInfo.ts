import * as React from 'react';
import { autorun } from 'mobx';
import { fileUtil, ValidationType } from '@nara.drama/depot';
import Post from '../model/Post';
import PostStore from '../mobx/PostStore';
import { registerPost, findPost, modifyPost, removePost } from '../api/PostApi';
import PostCdoModel from '../model/PostCdoModel';
import { MenuViewModel } from '../../menu/model/Menu';

export function useCreatePostBasicInfo(): [
  Post | undefined,
  (file: File, setFileName: any) => void,
  () => void,
  (name: string, value: any) => void,
  PostCdoModel | undefined,
  (communityId: string, postId: string) => void,
  () => void,
  (selectMenus: MenuViewModel[]) => any
] {
  const postStore = PostStore.instance;
  const [value, setValue] = React.useState<Post | undefined>(postStore.selected);
  const [postCdo, setPostCdo] = React.useState<PostCdoModel | undefined>(postStore.selectedPostCdo);

  React.useEffect(() => {
    return autorun(() => {
      setValue({ ...postStore.selected });
      setPostCdo({ ...postStore.selectedPostCdo });
    });
  }, [postStore]);

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
      changePostCdoProps('thumbnailId', data);
      // coursePlanService.changeCoursePlanProps('iconBox.baseUrl', data);
    };
    fileReader.readAsDataURL(file);
  }

  const changePostCdoProps = React.useCallback((name: string, value: any) => {
    //value.length 체크를 위해 any 처리
    if (name === 'name' && value.length > 100) {
      return;
    }

    //게시물을 공지사항메뉴로 옮겼을 때, 메뉴Id변경 뿐만 아니라 type까지 변경해줌.
    if (name === 'menuId' && value === 'NOTICE') {
      postStore.setPostCdo(postStore.selectedPostCdo, 'type', 'NOTICE');
    }

    if (name === 'description' && value.length > 100) {
      return;
    }

    if (value === '전체') value = '';

    postStore.setPostCdo(postStore.selectedPostCdo, name, value);
  }, []);

  const savePost = React.useCallback(() => {
    postCdo?.postId && postCdo?.postId !== ''
      ? modifyPost(postCdo?.postId, postStore.selectedPostCdo).then(postStore.clearPostCdo)
      : registerPost(postStore.selectedPostCdo).then(postStore.clearPostCdo);
  }, [postCdo]);

  const deletePost = React.useCallback(() => {
    if (postCdo?.postId && postCdo?.postId !== '') {
      removePost(postCdo?.communityId, postCdo?.postId).then(postStore.clearPostCdo);
    }
  }, [postCdo]);

  const findPostById = React.useCallback((communityId: string, postId: string) => {
    findPost(communityId, postId).then((response) => {
      const next = <PostCdoModel>response;
      postStore.selectPostCdo(next);
    });
  }, []);
  const selectMenu = React.useCallback((selectMenus: MenuViewModel[]) => {
    const fieldSelect: any = [];
    if (selectMenus) {
      fieldSelect.push({ key: 0, text: '공지사항', value: 'NOTICE' });
      selectMenus.map((menu, index) => {
        fieldSelect.push({
          key: index + 1,
          text: menu.name,
          value: menu.menuId,
        });
      });
    }
    return fieldSelect;
  }, []);

  return [value, uploadFile, savePost, changePostCdoProps, postCdo, findPostById, deletePost, selectMenu];
}
