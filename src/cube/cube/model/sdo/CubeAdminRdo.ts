import { decorate, observable } from 'mobx';

import { CubeType, SortFilterState } from 'shared/model';

export class CubeAdminRdo {
  //
  collegeId: string = '';
  channelId: string = '';
  cubeType: CubeType | null = CubeType.Audio;
  organizerId: string = '';
  enabled: boolean | string = '';
  name: string = '';
  registrantName: string = '';
  cineroomId: string = '';
  startDate: number = 0;
  endDate: number = 0;
  sharedOnly: boolean = false;
  limit: number = 0;
  offset: number = 0;

  // sortOrder: CubeSortOrder = CubeSortOrder.CreationTimeDesc;
  sortOrder: SortFilterState = SortFilterState.TimeDesc;

  forSelection: boolean = false;

  constructor(cubeAdminRdo?: CubeAdminRdo) {
    //
    if (cubeAdminRdo) {
      Object.assign(this, { ...cubeAdminRdo });
    }
  }
}

decorate(CubeAdminRdo, {
  collegeId: observable,
  channelId: observable,
  cubeType: observable,
  organizerId: observable,
  enabled: observable,
  name: observable,
  registrantName: observable,
  cineroomId: observable,
  startDate: observable,
  endDate: observable,
  limit: observable,
  offset: observable,
});
