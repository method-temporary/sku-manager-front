import { decorate, observable } from 'mobx';

import { QueryModel, SelectType } from 'shared/model';

import { PostRdoModel } from './PostRdoModel';

export class PostQueryModel extends QueryModel {
  //
  title: any;
  pinned: any = 'All';
  answered: any = 'All';
  companyCode: any = 'All';

  categoryName: any;
  writerName: any;

  static asPostRdo(postQuery: PostQueryModel, companyCode?: string): PostRdoModel {
    let isTitle = false;
    let isName = false;
    let searchAll = false;
    let categoryName = '';
    if (postQuery.searchPart === '제목') isTitle = true;
    if (postQuery.searchPart === '작성자') isName = true;
    if (postQuery.searchPart === '전체') searchAll = true;
    if (postQuery.categoryName) categoryName = postQuery.categoryName;
    return {
      startDate: postQuery && postQuery.period && postQuery.period.startDateLong,
      endDate: postQuery && postQuery.period && postQuery.period.endDateLong,
      title: (isTitle && postQuery && postQuery.searchWord) || '',
      pinned: postQuery && postQuery.pinned,
      answered: postQuery && postQuery.answered,
      companyCode: (companyCode && companyCode) || (postQuery && postQuery.companyCode),
      categoryName: categoryName || '',
      writerName: (isName && postQuery && postQuery.searchWord) || '',
      searchAll: (searchAll && postQuery && postQuery.searchWord) || '',
      offset: postQuery && postQuery.offset,
      limit: postQuery && postQuery.limit,
    };
  }

  static isBlank(postQuery: PostQueryModel): string {
    //
    if (postQuery && postQuery.searchPart === SelectType.searchWordForBoard[1].value && !postQuery.searchWord) {
      return '검색어';
    }

    if (postQuery && postQuery.searchPart === SelectType.searchWordForBoard[2].value && !postQuery.searchWord) {
      return '검색어';
    }

    //
    // if (!postQuery.searchWord && postQuery.searchPart) {
    //   return '검색어';
    // }

    // if (postQuery.answered === 'All' && !postQuery.searchWord && !postQuery.categoryName) {
    //   return '항목';
    // }
    // if (postQuery.pinned === true && !postQuery.period === null) {
    //   return '검색날짜';
    // }
    return 'success';
  }
}

decorate(PostQueryModel, {
  period: observable,
  title: observable,
  pinned: observable,
  answered: observable,
  companyCode: observable,
  categoryName: observable,
  writerName: observable,
  searchPart: observable,
  searchWord: observable,
  offset: observable,
  limit: observable,
});
