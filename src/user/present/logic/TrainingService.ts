import { observable, action, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import _ from 'lodash';

import { PageModel } from 'shared/model';

import { TrainingListViewModel } from '../../model/TrainingListViewModel';
import { TrainingQueryModel } from '../../model/TrainingQueryModel';
import { TrainingCountModel } from '../../model/TrainingCountModel';

import TrainingApi from '../apiclient/TrainingApi';

@autobind
class TrainingService {
  //
  static instance: TrainingService;

  trainingApi: TrainingApi;

  @observable
  training: TrainingListViewModel = new TrainingListViewModel();

  @observable
  trainings: TrainingListViewModel[] = [];

  @observable
  trainingQuery: TrainingQueryModel = new TrainingQueryModel();

  @observable
  courseTrainingQuery: TrainingQueryModel = new TrainingQueryModel();

  @observable
  trainingCount: TrainingCountModel = new TrainingCountModel();

  @observable
  trainingsForExcel: TrainingListViewModel[] = [];

  @observable
  trainingsForCard: TrainingListViewModel[] = [];

  constructor(trainingApi: TrainingApi) {
    this.trainingApi = trainingApi;
  }

  @action
  clearQuery() {
    this.trainingQuery = new TrainingQueryModel();
  }

  @action
  changeTrainingProp(name: string, value: any) {
    //
    this.training = _.set(this.training, name, value);
  }

  @action
  changeTrainingQueryProps(name: string, value: any) {
    //
    if (value === '전체') value = '';
    this.trainingQuery = _.set(this.trainingQuery, name, value);
  }

  @action
  changeTrainingsProp(index: number, name: string, value: any) {
    //
    this.trainings = _.set(this.trainings, `[${index}].${name}`, value);
  }

  @action
  changeTrainingsForExcelProp(index: number, name: string, value: any) {
    //
    this.trainingsForExcel = _.set(this.trainingsForExcel, `[${index}].${name}`, value);
  }

  @action
  changeTrainingsForCardProp(index: number, name: string, value: any) {
    //
    this.trainingsForCard = _.set(this.trainingsForCard, `[${index}].${name}`, value);
  }

  @action
  selectTraining(index: number) {
    this.training = this.trainings[index];
  }

  @action
  clearTrainingsForCard() {
    this.trainingsForCard = [];
  }

  @action
  pushTrainingsForCourse(training: TrainingListViewModel) {
    this.trainingsForCard.push(training);
  }

  @action
  setTrainings(trainings: TrainingListViewModel[]) {
    //
    this.trainings = [...trainings];
  }

  @action
  setTrainingsForExcel(trainings: TrainingListViewModel[]) {
    //
    this.trainingsForExcel = [...trainings];
  }

  async findAllTrainings(pageModel: PageModel) {
    //
    const offsetElementList = await this.trainingApi.findAllTrainingsBySearchKey(
      TrainingQueryModel.asTrainingRdo(this.trainingQuery, pageModel)
    );

    runInAction(
      () => (this.trainings = offsetElementList.results.map((training) => new TrainingListViewModel(training)))
    );

    return offsetElementList;
  }

  async findAllTrainingCount() {
    //
    const trainingCount = await this.trainingApi.findAllTrainingCountBySearchKey(
      TrainingQueryModel.asTrainingRdo(this.trainingQuery, new PageModel(0, 99999999))
    );
    return runInAction(() => {
      this.trainingCount = trainingCount;
    });
  }

  async findAllTrainingsForCard(profileId: string, cardId: string) {
    //
    const trainingsForCards = await this.trainingApi.findAllTrainingForCard(profileId, cardId);

    runInAction(() => (this.trainingsForCard = TrainingListViewModel.fromTrainingForCard(trainingsForCards)));
  }

  async findAllTrainingsForExcel() {
    const trainings = await this.trainingApi.findAllTrainingsBySearchKey(
      TrainingQueryModel.asTrainingRdo(this.trainingQuery, new PageModel(0, 99999999))
    );
    runInAction(
      () => (this.trainingsForExcel = trainings.results.map((training) => new TrainingListViewModel(training)))
    );
    return this.trainingsForExcel;
  }
}

TrainingService.instance = new TrainingService(TrainingApi.instance);
export default TrainingService;
