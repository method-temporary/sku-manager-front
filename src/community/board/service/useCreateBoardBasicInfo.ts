import * as React from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';
import { fileUtil, ValidationType } from '@nara.drama/depot';
import PostModel from '../model/PostModel';
import BoardStore from '../mobx/BoardStore';
import BoardCdoModel from '../model/BoardCdoModel';
import { registerBoard, findBoard } from '../api/BoardApi';

export function useCreateBoardBasicInfo(): [
  PostModel | undefined,
  (value: any, setName: any) => void,
  (value: any, setDescription: any) => void,
  (file: File, setFileName: any, setIconBox: any) => void,
  () => void,
  (name: string, value: string | number | Moment | undefined) => void,
  BoardCdoModel | undefined,
  (postId: string) => void
] {
  const boardStore = BoardStore.instance;
  const [value, setValue] = React.useState<PostModel | undefined>(boardStore.selectedPost);
  const [boardCdo, setboardCdo] = React.useState<BoardCdoModel | undefined>(boardStore.selectedBoardCdo);

  React.useEffect(() => {
    return autorun(() => {
      setValue(boardStore.selectedPost);
      setboardCdo({ ...boardStore.selectedBoardCdo });
    });
  }, [boardStore]);

  // function onChangeBoardName(name: string) {
  //   const invalid = name.length > 100;
  //   if (invalid) {
  //     return;
  //   }
  //   boardStore.changeName(name);
  // }

  function onChangeBoardName(value: any, setName: any) {
    const invalid = value.length > 100;
    if (invalid) {
      return;
    }
    setName(value);
  }

  function onChangeBoardDescription(value: any, setDescription: any) {
    const invalid = value.length > 100;
    if (invalid) {
      return;
    }
    setDescription(value);
  }

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

  function uploadFile(file: File, setFileName: any, setIconBox: any) {
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
      changeBoardCdoProps('thumbnailId', data);
      // coursePlanService.changeCoursePlanProps('iconBox.baseUrl', data);
      setIconBox(data);
    };
    fileReader.readAsDataURL(file);
  }

  // const saveRow = React.useCallback(
  //   (id: string) => {
  //     if (value === undefined) {
  //       return;
  //     }
  //     // const field = value.find(c=>c.id === id);
  //     // if(field === undefined){
  //     //   return;
  //     // }
  //     // if(id === ''){

  //     //registerBoard().then();
  //     // } else {
  //     //   const nameValueList = new NameValueList();
  //     //   nameValueList.nameValues.push({name:'title', value:field.title});
  //     //   modifyField(id, nameValueList)
  //     //   .then(requestFieldList);
  //     // }
  //     // setEditedId(undefined);
  //   },
  //   [boardStore, value]
  // );

  const changeBoardCdoProps = React.useCallback((name: string, value: string | Moment | number | undefined) => {
    if (value === '전체') value = '';

    boardStore.setBoardCdo(boardStore.selectedBoardCdo, name, value);
  }, []);

  const saveBoard = React.useCallback(() => {
    // const boardCdo = getBoardCdo();

    // boardCdo.name = 'nameTest';
    // boardCdo.type = 'open';
    // boardCdo.field = 'new1';
    // boardCdo.thumbnailId = 'thumbnailId';
    // boardCdo.description = 'description';
    // boardCdo.managerId = 'managerId';
    // boardCdo.managerName = 'managerName';
    // boardCdo.visible = '1';
    // registerBoard(boardCdo).then();
    changeBoardCdoProps('type', 'Open');
    registerBoard(boardStore.selectedBoardCdo).then();
  }, []);

  const findPost = React.useCallback((postId: string) => {
    findBoard(postId).then((response) => {
      const next = <PostModel>response;
      boardStore.selectPost(next);
    });
  }, []);

  return [
    value,
    onChangeBoardName,
    onChangeBoardDescription,
    uploadFile,
    saveBoard,
    changeBoardCdoProps,
    boardCdo,
    findPost,
  ];
}
