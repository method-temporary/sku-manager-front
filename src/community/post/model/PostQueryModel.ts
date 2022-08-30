import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import PostRdo from './PostRdo';

export class PostQueryModel extends QueryModel {
  searchFilter: string = '';
  popup: boolean = false;
  precedence: boolean | undefined = false;

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;
  communityId: string = '';
  menuId: string = '';

  static asPostRdo(postQuery: PostQueryModel): PostRdo {
    //
    let isTitle = false;
    let isHtml = false;
    let isCreatorName = false;
    if (postQuery.searchPart === '제목') isTitle = true;
    if (postQuery.searchPart === '내용') isHtml = true;
    if (postQuery.searchPart === '작성자') isCreatorName = true;

    return {
      startDate: postQuery.period.startDateLong,
      endDate: postQuery.period.endDateLong,
      title: (isTitle && postQuery && postQuery.searchWord) || '',
      html: (isHtml && postQuery && postQuery.searchWord) || '',
      creatorName: (isCreatorName && postQuery && postQuery.searchWord) || '',
      offset: postQuery.offset,
      limit: postQuery.limit,
      searchFilter: postQuery.searchFilter,
      menuId: postQuery.menuId,
      communityId: postQuery.communityId,
    };
  }
}

decorate(PostQueryModel, {
  searchFilter: observable,
  popup: observable,
  currentPage: observable,
  precedence: observable,
  menuId: observable,
  communityId: observable,
});
