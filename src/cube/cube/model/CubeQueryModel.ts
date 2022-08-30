import { decorate, observable } from 'mobx';

import { QueryModel, PageModel, CubeType } from 'shared/model';

import { CubeSortOrder } from './sdo/CubeSortOrder';
import { CubeAdminRdo } from './sdo/CubeAdminRdo';

export class CubeQueryModel extends QueryModel {
  //
  collegeId: string = '';
  channelId: string = '';
  cubeType: CubeType = CubeType.ALL;
  organizerId: string = '전체';
  enabled: boolean | string = '전체';
  name: string = '';
  creatorName: string = ''; // registrantName
  cineroomId: string = '';
  startDate: number = 0;
  endDate: number = 0;
  sharedOnly: boolean = false;

  sortFilter: CubeSortOrder = CubeSortOrder.RegisteredTimeDesc;

  searchPart: string = '과정명';

  forSelection: boolean = false;

  constructor(cubeAdminRdo?: CubeQueryModel) {
    //
    super();
    if (cubeAdminRdo) {
      Object.assign(this, { ...cubeAdminRdo });
    }
  }

  static asCubeAdminRdo(cubeQuery: CubeQueryModel, pageModel: PageModel): CubeAdminRdo {
    //

    return {
      collegeId: cubeQuery.collegeId === '전체' ? '' : cubeQuery.collegeId,
      channelId: cubeQuery.channelId,
      cubeType: cubeQuery.cubeType === CubeType.ALL ? null : cubeQuery.cubeType,
      organizerId: cubeQuery.organizerId === '전체' ? '' : cubeQuery.organizerId,
      enabled: cubeQuery.enabled === '전체' ? '' : cubeQuery.enabled,
      name: cubeQuery.searchPart === '과정명' ? cubeQuery.searchWord.replaceAll('"', '\\"') : '',
      registrantName: cubeQuery.searchPart === '생성자' ? cubeQuery.searchWord : '',
      cineroomId: cubeQuery.cineroomId,
      startDate: cubeQuery.period.startDateLong,
      endDate: cubeQuery.period.endDateLong,
      sharedOnly: cubeQuery.sharedOnly,

      limit: pageModel.limit,
      offset: pageModel.offset,

      //TODO: 정렬값 초기회 문제 있음
      sortOrder: pageModel.sortFilter,

      forSelection: cubeQuery.forSelection,
    };
  }
}

decorate(CubeQueryModel, {
  collegeId: observable,
  channelId: observable,
  cubeType: observable,
  organizerId: observable,
  enabled: observable,
  name: observable,
  creatorName: observable,
  cineroomId: observable,
  startDate: observable,
  endDate: observable,
  sharedOnly: observable,
});
