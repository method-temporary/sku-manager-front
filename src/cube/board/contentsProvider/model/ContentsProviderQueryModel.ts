import { decorate, observable } from 'mobx';
import { QueryModel, PageModel } from 'shared/model';

import { AreaType } from '../../../../college/model/AreaType';
import ContentsProviderRdo from './ContentsProviderRdo';

export class ContentsProviderQueryModel extends QueryModel {
  searchFilter: string = '';
  popup: boolean = false;
  precedence: boolean | undefined = false;

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;

  areaType?: AreaType;
  enabled: string = '';

  menuId: string = '';

  creatorName: string = '';
  creatorEmail: string = '';
  providerName: string = '';

  static asContentsProviderRdo(
    contentsProviderQuery: ContentsProviderQueryModel,
    pageModel: PageModel
  ): ContentsProviderRdo {
    //
    let isCreatorName = false;
    let isEmail = false;
    let isProviderName = false;
    if (contentsProviderQuery.searchPart === '등록자명') isCreatorName = true;
    if (contentsProviderQuery.searchPart === '등록자 e-mail') isEmail = true;
    if (contentsProviderQuery.searchPart === '교육기관명') {
      isProviderName = true;
    }

    return {
      startDate: contentsProviderQuery.period.startDateLong,
      endDate: contentsProviderQuery.period.endDateLong,
      registrantName:
        (isCreatorName && contentsProviderQuery && encodeURIComponent(contentsProviderQuery.searchWord)) || '',
      creatorEmail: (isEmail && contentsProviderQuery && encodeURIComponent(contentsProviderQuery.searchWord)) || '',
      providerName:
        (isProviderName && contentsProviderQuery && encodeURIComponent(contentsProviderQuery.searchWord)) || '',
      offset: pageModel.offset,
      limit: pageModel.limit,
      searchFilter: contentsProviderQuery.searchFilter,
      areaType: contentsProviderQuery.areaType,
      enabled: contentsProviderQuery.enabled,
    };
  }
}

decorate(ContentsProviderQueryModel, {
  searchFilter: observable,
  currentPage: observable,
  page: observable,
  creatorName: observable,
  creatorEmail: observable,
  providerName: observable,
  areaType: observable,
  enabled: observable,
});
