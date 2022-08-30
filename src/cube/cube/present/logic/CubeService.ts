import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import { autobind, observableArray } from '@nara.platform/accent';

import { OffsetElementList, CardCategory } from 'shared/model';

import { findAllSearchTagByTag } from 'cube/board/searchTag/api/searchTagApi';
import { parsePanoptoCardThumbnailSelect } from 'card/card/present/logic/CardThumbnailSelectService';

import Community, { getEmptyCommunity } from '../../../../community/community/model/Community';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';
import SearchTagRdo from '../../../board/searchTag/model/SearchTagRdo';
import SearchTag from '../../../board/searchTag/model/SearchTag';
import {
  CubeModel,
  CubeWithReactiveModel,
  CubeSdo,
  CubeDetail,
  CubeQueryModel,
  CubeAdminRdo,
  CubeContentsModel,
  CubeWithContents,
} from '../..';
import CubeInstructorModel from '../../CubeInstructorModel';
import CubePolyglotUdo from '../../model/sdo/CubePolyglotUdo';
import DuplicateCubeNameRdo from '../../model/sdo/DuplicateCubeNameRdo';
import CubeApi from '../apiclient/CubeApi';
import { CollegeModel } from 'college/model/CollegeModel';
import { ChannelModel } from 'cube/board/board/model/ChannelModel';

@autobind
export default class CubeService {
  //
  static instance: CubeService;

  cubeApi: CubeApi;

  constructor(cubeApi: CubeApi) {
    this.cubeApi = cubeApi;
  }

  @observable
  cube: CubeModel = new CubeModel();

  @observable
  cubes: CubeModel[] = [];

  @observable
  cubeDetail: CubeDetail = new CubeDetail();

  @observable
  cubeWithReactiveModels: CubeWithReactiveModel[] = [];

  @observable
  mainCategory: CardCategory = new CardCategory();

  @observable
  subCategories: CardCategory[] = [];

  @observable
  cubeCommunity: Community = getEmptyCommunity();

  @observable
  cubeInstructors: CubeInstructorModel[] = [];

  @observable
  cubeOperator: OperatorModel = new OperatorModel();

  @observable
  fileBoxId: string = '';

  @observable
  cubeQuery: CubeQueryModel = new CubeQueryModel();

  @observable
  categoryMap: Map<string, string[]> = new Map<string, string[]>();

  @observable
  selectedCubes: CubeWithReactiveModel[] = [];

  @observable
  selectedIds: string[] = [];

  @observable
  searchTags: SearchTag[] = [];

  @observable
  cubeWithContents: CubeWithContents[] = [];

  @observable
  selectedCubeInstructor: CubeInstructorModel = new CubeInstructorModel();

  @observable
  cubeUdos: CubePolyglotUdo[] = [];

  @observable
  selectedCollege: CollegeModel = new CollegeModel();

  @observable
  selectedChannel: ChannelModel = new ChannelModel();

  @action
  setSelectedChannel(channel: ChannelModel) {
    //
    this.selectedChannel = channel;
  }

  @action
  setSelectedCollege(college: CollegeModel) {
    //
    console.log(college);
    this.selectedCollege = college;
  }

  @action
  clearSelectedCollege() {
    //
    this.selectedChannel = new ChannelModel();
    this.selectedCollege = new CollegeModel();
  }

  //// cube
  async registerCube(cubeSdo: CubeSdo): Promise<string> {
    //
    return this.cubeApi.registerCube(cubeSdo);
  }

  @action
  async findCubesByIds(ids: string[]): Promise<CubeModel[]> {
    const cubes = await this.cubeApi.findCubesForAdminByIds(ids);
    runInAction(() => {
      this.cubes = cubes.map((cube) => new CubeModel(cube));
    });

    return cubes;
  }

  @action
  async findCubesIgnoringAccessibilityByQdo(
    cubeAdminRdo: CubeAdminRdo
  ): Promise<OffsetElementList<CubeWithReactiveModel>> {
    //
    const offsetElementList = await this.cubeApi.findCubesIgnoringAccessibilityByQdo(cubeAdminRdo);

    runInAction(() => {
      this.cubeWithReactiveModels = offsetElementList.results.map((cube) => new CubeWithReactiveModel(cube));
    });

    return offsetElementList;
  }

  @action
  async modifyCube(cubeId: string, cubeSdo: CubeSdo): Promise<void> {
    return this.cubeApi.modifyCube(cubeId, cubeSdo);
  }

  async findCubeCountByName(rdo: DuplicateCubeNameRdo): Promise<number> {
    return this.cubeApi.findCubeCountByName(rdo);
  }

  @action
  changeCubeProps(name: string, value: any): void {
    //
    this.cube = _.set(this.cube, name, value);
  }

  @action
  clearCube(): void {
    this.cube = new CubeModel();
  }

  @action
  clearCubes(): void {
    this.cubes = [];
  }

  // @action
  // deleteCube(cubeId: string) {
  //   //TODO: 큐브삭제
  // }

  //// cubeDetail
  @action
  async findCubeDetail(cubeId: string): Promise<CubeDetail> {
    //
    const cubeDetail = await this.cubeApi.findCubeDetailForAdmin(cubeId);
    runInAction(() => {
      this.cubeDetail = new CubeDetail(cubeDetail);
      this.cube = new CubeModel(cubeDetail.cube);
      this.changeCubeProps('cubeContents', new CubeContentsModel(cubeDetail.cubeContents));
    });
    return cubeDetail;
  }

  @action
  clearCubeDetail(): void {
    this.cubeDetail = new CubeDetail();
  }

  @action
  changeCubeDetailProps(name: string, value: any): void {
    this.cubeDetail = _.set(this.cubeDetail, name, value);
  }

  //// cubesWithReactive

  @action
  async findCubeWithReactiveModelsForAdmin(
    cubeAdminRdo: CubeAdminRdo
  ): Promise<OffsetElementList<CubeWithReactiveModel>> {
    //
    const cubeWithReactiveModels = await this.cubeApi.findCubeWithReactiveModelsForAdmin(cubeAdminRdo);
    runInAction(() => {
      this.cubeWithReactiveModels = cubeWithReactiveModels.results.map((cube) => new CubeWithReactiveModel(cube));
    });
    return cubeWithReactiveModels;
  }

  //// mainCategory

  @action
  clearMainCategory() {
    //
    this.mainCategory = new CardCategory();
  }

  @action
  clearChannel() {
    //
    this.mainCategory.twoDepthChannelId = '';
    this.mainCategory.channelId = '';
  }

  @action
  changeMainCategoryProps(name: string, value: any) {
    //
    this.mainCategory = _.set(this.mainCategory, name, value);
  }

  //// subCategories

  @action
  setSubCategories(subCategories: CardCategory[]) {
    //
    this.subCategories = subCategories;
  }

  @action
  clearSubCategories(): void {
    //
    this.subCategories = [];
  }

  //// categoryMap

  @action
  changeCategoryMapProps(categoryMap: Map<string, string[]>) {
    //
    this.categoryMap = categoryMap;
  }

  @action
  setCategoryMapProps(collegeId: string, value: string[]) {
    //
    this.categoryMap.set(collegeId, value);
  }

  @action
  clearCategoryMap() {
    this.categoryMap = new Map<string, string[]>();
  }

  //// cubeCommunity

  @action
  setCubeCommunity(community: Community): void {
    this.cubeCommunity = community;
  }

  @action
  changeCubeCommunityProps(name: string, value: any): void {
    this.cubeCommunity = _.set(this.cubeCommunity, name, value);
  }

  @action
  clearCubeCommunity(): void {
    this.cubeCommunity = getEmptyCommunity();
  }

  /// cubeInstructors
  @action
  setCubeInstructors(instructors: CubeInstructorModel[]): void {
    this.cubeInstructors = instructors;
  }

  @action
  changeTargetCubeInstructorProp(index: number, name: string, value: boolean): void {
    this.cubeInstructors = _.set(this.cubeInstructors, `[${index}].${name}`, value);
  }

  @action
  changeCubeInstructorPropById(id: string, round: number, name: string, value: any): void {
    const index = this.cubeInstructors.findIndex((target) => target.id === id && target.round === round);
    this.cubeInstructors = _.set(this.cubeInstructors, `[${index}].${name}`, value);
  }

  @action
  addCubeInstructors(cubeInstructor: CubeInstructorModel): void {
    this.cubeInstructors.push(cubeInstructor);
  }

  @action
  deleteTargetCubeInstructor(index: number): void {
    this.cubeInstructors.splice(index, 1);
  }

  @action
  clearCubeInstructors(): void {
    this.cubeInstructors = [];
  }

  //// cubeOperators

  @action
  setCubeOperator(operator: OperatorModel): void {
    this.cubeOperator = operator;
  }

  @action
  clearCubeOperator(): void {
    this.cubeOperator = new OperatorModel();
  }

  ////

  // @action
  // changeFileBoxId(value: string): void {
  //   this.fileBoxId = value;
  // }

  @action
  clearFileBoxId(): void {
    this.fileBoxId = '';
  }

  //// cubeQuery

  @action
  changeCubeQueryProps(name: string, value: any): void {
    //
    this.cubeQuery = _.set(this.cubeQuery, name, value);
  }

  @action
  clearCubeQuery(): void {
    this.cubeQuery = new CubeQueryModel();
  }

  //// selectedCubes

  @action
  setSelectedCubes(cubes: CubeWithReactiveModel[]) {
    //
    this.selectedCubes = [...cubes];
  }

  @action
  addSelectedCubes(cube: CubeWithReactiveModel) {
    //
    this.selectedCubes = [...this.selectedCubes, cube];
  }

  @action
  removeSelectedCubes(id: string) {
    //
    const copied = [...this.selectedCubes];
    const newCubes = copied.filter((cubeWiths) => cubeWiths.cubeId !== id);

    this.selectedCubes = [...newCubes];
  }

  @action
  clearSelectedCubes() {
    //
    this.selectedCubes = [];
  }

  @action
  setSelectedIds(ids: string[]) {
    //
    this.selectedIds = [...ids];
  }

  @action
  addSelectedIds(id: string) {
    //
    this.selectedIds = [...this.selectedIds, id];
  }

  @action
  removeSelectedIds(id: string) {
    //
    const index = this.selectedIds.indexOf(id);
    const copied = [...this.selectedIds];

    copied.splice(index, 1);
    this.selectedIds = copied;
  }

  @action
  clearSelectedIds() {
    //
    this.selectedIds = [];
  }

  // searchTags

  @action
  async findAllSearchTagByTag(searchTagRdo: SearchTagRdo) {
    //
    const searchTags = await findAllSearchTagByTag(searchTagRdo);
    runInAction(() => (this.searchTags = searchTags.results));
  }

  @action
  clearSearchTags() {
    this.searchTags = [];
  }

  // Cube With Contents
  @action
  async findCubeWithContentsByIds(ids: string[]) {
    //
    const cubeWithContents = await this.cubeApi.findCubeWithContentByIdsPost(ids);
    runInAction(() => (this.cubeWithContents = cubeWithContents));
    parsePanoptoCardThumbnailSelect(ids);

    return cubeWithContents;
  }

  // Selected Cube Instructor
  @action
  setSelectedCubeInstructor(selectedCubeInstructor: CubeInstructorModel) {
    this.selectedCubeInstructor = selectedCubeInstructor;
  }

  @action
  clearSelectedCubeInstructor() {
    //
    this.selectedCubeInstructor = new CubeInstructorModel();
  }

  // cubeUdos
  modifyPolyglotForAdmin(cubeId: string, cubePolyglotUdo: CubePolyglotUdo): Promise<void> {
    //
    return this.cubeApi.modifyPolyglotForAdmin(cubeId, cubePolyglotUdo);
  }

  @action
  setCubeUdos(udos: CubePolyglotUdo[]): void {
    this.cubeUdos = udos;
  }
}

Object.defineProperty(CubeService, 'instance', {
  value: new CubeService(CubeApi.instance),
  writable: false,
  configurable: false,
});
