import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import RollBookApi from '../apiclient/RollBookApi';
import { RollBookModel } from '../../model/RollBookModel';

@autobind
export default class RollBookService {
  //
  static instance: RollBookService;

  rollBookApi: RollBookApi;

  @observable
  rollBook: RollBookModel = {} as RollBookModel;

  @observable
  rollBooks: RollBookModel[] = [];

  constructor(rollBookApi: RollBookApi) {
    this.rollBookApi = rollBookApi;
  }

  @action
  async findRollBookByLectureCardIdAndRound(lectureCardId: string, round: number) {
    //
    const rollBook = await this.rollBookApi.findRollBookByLectureCardIdAndRound(lectureCardId, round);
    return runInAction(() => this.rollBook = new RollBookModel(rollBook));
  }

  @action
  async findAllLecturesByLectureCardId(lectureCardId: string) {
    //
    const rollBooks = await this.rollBookApi.findAllLecturesByLectureCardId(lectureCardId);
    return runInAction(() => this.rollBooks = rollBooks);
  }
}

Object.defineProperty(RollBookService, 'instance', {
  value: new RollBookService(RollBookApi.instance),
  writable: false,
  configurable: false,
});
