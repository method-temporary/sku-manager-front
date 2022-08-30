import { useState, useCallback, useEffect } from 'react';
import { autorun } from 'mobx';
import { Moment } from 'moment';
import { NaOffsetElementList } from 'shared/model';
import { responseToNaOffsetElementList } from 'shared/helper';
import Post from '../model/Post';
import { PostQueryModel } from '../model/PostQueryModel';
import PostStore from '../mobx/PostStore';
import { findAllPostByQuery, findAllPostByQueryForExcel } from '../api/PostApi';
import { SharedService } from '../../../shared/present';
import { MenuViewModel } from '../../menu/model/Menu';

export default interface PostTemp {
  id?: number;
}

export function usePostList(): [
  NaOffsetElementList<Post>,
  (name: string, value: string | number | Moment | undefined) => void,
  () => void,
  PostQueryModel,
  () => void,
  (selectFields: MenuViewModel[]) => any,
  SharedService,
  () => Promise<null | NaOffsetElementList<Post>>
] {
  const postStore = PostStore.instance;
  const sharedService = SharedService.instance;

  const [valule, setValue] = useState<NaOffsetElementList<Post>>(postStore.postList);

  const [query, setQuery] = useState<PostQueryModel>(postStore.selectedPostQuery);

  useEffect(() => {
    searchQuery();
    return autorun(() => {
      setValue({ ...postStore.postList });
      setQuery({ ...postStore.selectedPostQuery });
    });
  }, [postStore]);

  const clearPostQuery = useCallback(() => {
    postStore.clearPostQuery();
  }, []);

  const requestFindAllPostByQuery = useCallback((postQueryModel: PostQueryModel) => {
    if (sharedService) {
      if (postQueryModel.page) {
        changePostQueryProps('offset', (postQueryModel.page - 1) * postQueryModel.limit);
        changePostQueryProps('pageIndex', (postQueryModel.page - 1) * postQueryModel.limit);
        sharedService.setPage('post', postQueryModel.page);
      } else {
        sharedService.setPageMap('post', 0, postQueryModel.limit);
      }
    }

    findAllPostByQuery(PostQueryModel.asPostRdo(postQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<Post>(response);
      //sharedService.setState({ pageIndex: (page - 1) * 20 });
      next.limit = postQueryModel.limit;
      next.offset = postQueryModel.offset;
      sharedService.setCount('post', next.totalCount);
      postStore.setPostList(next);
    });
  }, []);

  const selectMenu = useCallback((selectMenus: MenuViewModel[]) => {
    const fieldSelect: any = [];
    const field = selectMenus.filter((x) => {
      return x.type !== 'DISCUSSION';
    });
    if (field) {
      fieldSelect.push({ key: 'All', text: '전체', value: '전체' });
      fieldSelect.push({ key: 0, text: '공지사항', value: 'NOTICE' });
      field.map((menu, index) => {
        fieldSelect.push({
          key: index + 1,
          text: menu.name,
          value: menu.id,
        });
      });
    }

    return fieldSelect;
  }, []);

  const changePostQueryProps = useCallback((name: string, value: string | Moment | number | undefined) => {
    if (value === '전체') value = '';

    postStore.setPostQuery(postStore.selectedPostQuery, name, value);

    if (name === 'limit') {
      changePostQueryProps('pageIndex', 0);
      changePostQueryProps('page', 0);
      changePostQueryProps('offset', 0);
      searchQuery();
    }
  }, []);

  const searchQuery = useCallback(() => {
    postStore.clearPostCdo();
    requestFindAllPostByQuery(postStore.selectedPostQuery);
  }, []);

  const excelSearchQuery = async () => {
    const postQueryModel = postStore.selectedPostQuery;
    postQueryModel.limit = 99999999;
    let result = null;
    await findAllPostByQueryForExcel(PostQueryModel.asPostRdo(postQueryModel)).then((response) => {
      const next = responseToNaOffsetElementList<Post>(response);
      result = next;
    });
    return result;
  };

  return [
    valule,
    changePostQueryProps,
    searchQuery,
    query,
    clearPostQuery,
    selectMenu,
    sharedService,
    excelSearchQuery,
  ];
}
