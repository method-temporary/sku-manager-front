import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { PolyglotModel } from 'shared/model';

import AnswerApi from '../apiclient/AnswerApi';
import { AnswerModel } from '../../model/AnswerModel';
import AnswerFlowApi from '../apiclient/AnswerFlowApi';
import { AnswerFlowCdoModel } from '../../model/AnswerFlowCdoModel';
import { AnswerContentsModel } from '../../model/AnswerContentsModel';

@autobind
export default class AnswerService {
  //
  static instance: AnswerService;

  answerApi: AnswerApi;
  answerFlowApi: AnswerFlowApi;

  @observable
  answer: AnswerModel = new AnswerModel();

  @observable
  answers: AnswerModel[] = [];

  constructor(answerApi: AnswerApi, answerFlowApi: AnswerFlowApi) {
    //
    this.answerApi = answerApi;
    this.answerFlowApi = answerFlowApi;
  }

  registerAnswer(answer: AnswerModel) {
    //
    answer = _.set(answer, 'audienceKey', 'r2p8-r@nea-m5-c5');
    return this.answerApi.registerAnswer(answer);
  }

  @action
  initAnswerContents() {
    //
    this.answer = new AnswerModel();
  }

  @action
  async findAnswerByAnswerId(answerId: string) {
    //
    const answer = await this.answerApi.findAnswerByAnswerId(answerId);
    return runInAction(() => (this.answer = new AnswerModel(answer)));
  }

  @action
  async findAnswerByPostId(postId: string) {
    //
    const answer = await this.answerApi.findAnswerByPostId(postId);
    return runInAction(() => (this.answer = new AnswerModel(answer)));
  }

  @action
  async findAllAnswers() {
    //
    const answers = await this.answerApi.findAllAnswers();
    return runInAction(() => (this.answers = answers.map((answer) => new AnswerModel(answer))));
  }

  @action
  initAnswer() {
    //
    this.answer.contents = new AnswerContentsModel();
  }

  modifyAnswer(answerId: string, answer: AnswerModel) {
    //
    this.answerApi.modifyAnswer(answerId, AnswerModel.asNameValuesList(answer));
  }

  removeAnswer(answerId: string) {
    //
    this.answerApi.removeAnswer(answerId);
  }

  createAnswer(answer: AnswerModel) {
    //
    // answer = _.set(answer, 'audienceKey', 'r2p8-r@nea-m5-c5');

    return this.answerFlowApi.createAnswer(new AnswerFlowCdoModel(answer));
  }

  updateAnswer(answerId: string, answer: AnswerModel) {
    //
    return this.answerFlowApi.updateAnswer(answerId, AnswerModel.asNameValuesList(answer));
  }

  @action
  changeAnswerProps(name: string, value: string | PolyglotModel) {
    //
    this.answer = _.set(this.answer, name, value);
  }
}

Object.defineProperty(AnswerService, 'instance', {
  value: new AnswerService(AnswerApi.instance, AnswerFlowApi.instance),
  writable: false,
  configurable: false,
});
