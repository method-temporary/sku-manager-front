import { action, observable } from 'mobx';
import { CardSearchPartType } from '../../../../card/card/model/vo/CardSearchPartType';

import { CubeSearchPartType } from '../../model/CubeSearchPartType';
import { CubeAdminRdo, CubeWithReactiveModel } from '../../../cube';
import { CubeType } from '../../../../shared/model';

class CubeSelectedModalStore {
  //
  static instance: CubeSelectedModalStore;

  @observable
  cubeAdminRdo: CubeAdminRdo = new CubeAdminRdo();

  @observable
  startDate: number = 0;

  @observable
  endDate: number = 0;

  @observable
  collegeId: string = '';

  @observable
  channelId: string = '';

  @observable
  cubeType: CubeType = CubeType.ALL;

  @observable
  organizerId: string = '';

  @observable
  sharedOnly: boolean = false;

  @observable
  searchPart: CubeSearchPartType = '과정명';

  @observable
  searchWord: string = '';

  @observable
  offset: number = 1;

  @observable
  limit: number = 10;

  @observable
  selectedCubes: CubeWithReactiveModel[] = [];

  @action.bound
  setStartDate(startDate: number) {
    this.startDate = startDate;
  }

  @action.bound
  setEndDate(endDate: number) {
    this.endDate = endDate;
  }

  @action.bound
  setCollegeId(collegeId: string) {
    this.collegeId = collegeId;
  }

  @action.bound
  setChannelId(channelId: string) {
    this.channelId = channelId;
  }

  @action.bound
  setCubeType(cubeType: CubeType) {
    this.cubeType = cubeType;
  }

  @action.bound
  setOrganizerId(organizerId: string) {
    this.organizerId = organizerId;
  }

  @action.bound
  setSharedOnly(sharedOnly: boolean) {
    this.sharedOnly = sharedOnly;
  }

  @action.bound
  setSearchPart(searchPart: CardSearchPartType) {
    this.searchPart = searchPart;
  }

  @action.bound
  setSearchWord(searchWord: string) {
    this.searchWord = searchWord;
  }

  @action.bound
  setOffset(offset: number) {
    this.offset = offset;
  }

  @action.bound
  setLimit(limit: number) {
    this.limit = limit;
  }

  @action.bound
  setSelectedCubes(selectedCubes: CubeWithReactiveModel[]) {
    this.selectedCubes = selectedCubes;
  }

  @action.bound
  setCubeAdminRdo() {
    const cubeAdminRdo = new CubeAdminRdo();

    cubeAdminRdo.startDate = this.startDate;
    cubeAdminRdo.endDate = this.endDate;
    cubeAdminRdo.collegeId = this.collegeId;
    cubeAdminRdo.channelId = this.channelId;
    cubeAdminRdo.cubeType = this.cubeType;
    cubeAdminRdo.organizerId = this.organizerId;
    cubeAdminRdo.sharedOnly = this.sharedOnly;
    cubeAdminRdo.name = this.searchPart === '과정명' ? this.searchWord.replaceAll('"', '\\"') : '';
    cubeAdminRdo.registrantName = this.searchPart === '생성자' ? this.searchWord : '';
    cubeAdminRdo.offset = (this.offset - 1) * this.limit;
    cubeAdminRdo.limit = this.limit;
    cubeAdminRdo.forSelection = true;

    this.cubeAdminRdo = cubeAdminRdo;
  }

  @action.bound
  setCubeAdminRdoForPage(isSearch: boolean) {
    if (isSearch) {
      this.setCubeAdminRdo();
    } else {
      this.cubeAdminRdo = {
        ...this.cubeAdminRdo,
        offset: (this.offset - 1) * this.limit,
      };
    }
  }

  @action.bound
  reset() {
    //
    this.cubeAdminRdo = new CubeAdminRdo();
    this.startDate = 0;
    this.endDate = 0;
    this.collegeId = '';
    this.channelId = '';
    this.cubeType = CubeType.ALL;
    this.organizerId = '';
    this.sharedOnly = false;
    this.searchPart = '과정명';
    this.searchWord = '';

    this.offset = 1;
    this.limit = 10;
  }
}

CubeSelectedModalStore.instance = new CubeSelectedModalStore();
export default CubeSelectedModalStore;
