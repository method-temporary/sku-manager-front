import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import { NameValueList, IdName } from 'shared/model';
import LectureCardApi from '../apiclient/LectureCardApi';
import { LectureCardModel } from '../../model/LectureCardModel';

@autobind
export default class LectureService {
  //
  static instance: LectureService;

  lectureCardApi: LectureCardApi;

  @observable
  lectureCard: LectureCardModel = {} as LectureCardModel;

  @observable
  lectureCards: LectureCardModel[] = [];

  @observable
  lectureCardIdNames: IdName[] = [];

  constructor(lectureCardApi: LectureCardApi) {
    this.lectureCardApi = lectureCardApi;
  }

  @action
  async findLectureCard(lectureCardId: string) {
    //
    const lectureCard = await this.lectureCardApi.findLectureCard(lectureCardId);
    return runInAction(() => (this.lectureCard = new LectureCardModel(lectureCard)));
  }

  @action
  async findLectureCardByLearningCardId(learningCardId: string) {
    //
    const lectureCard = await this.lectureCardApi.findLectureCardByLearningCardId(learningCardId);
    return runInAction(() => (this.lectureCard = new LectureCardModel(lectureCard)));
  }

  @action
  async findAllLectureCards(offset: number = 0, limit: number = 20) {
    //
    const lectureCards = await this.lectureCardApi.findAllLectureCards(offset, limit);
    return runInAction(() => (this.lectureCards = lectureCards));
  }

  modifyLectureCard(lectureCard: string, nameValues: NameValueList) {
    //
    this.lectureCardApi.modifyLectureCard(lectureCard, nameValues);
  }

  @action
  async findLectureCardByCubeId(cubeId: string) {
    //
    const lectureCard = await this.lectureCardApi.findLectureCardByCubeId(cubeId);
    return runInAction(() => (this.lectureCard = lectureCard));
  }

  @action
  async findLectureCardIdName(lectureCardUsids: string[]) {
    //
    const lectureCards = await this.lectureCardApi.findLectureCardIdName(lectureCardUsids);
    return runInAction(() => (this.lectureCardIdNames = lectureCards));
  }
}

Object.defineProperty(LectureService, 'instance', {
  value: new LectureService(LectureCardApi.instance),
  writable: false,
  configurable: false,
});
