import autobind from 'autobind-decorator';
import { action, observable, runInAction, computed, toJS } from 'mobx';
import _ from 'lodash';

import { OffsetElementList } from '@nara.platform/accent';

import { OrderedOffset } from 'shared/model';

import { ReviewQuestionItems } from 'survey/form/model/ReviewQuestionItems';
import { ChoiceFixedQuestionItems } from 'survey/form/model/ChoiceFixedQuestionItems';
import SurveyFormApi from '../apiclient/SurveyFormApi';
import { SurveyFormModel } from '../../model/SurveyFormModel';
import { CriterionModel } from '../../model/CriterionModel';
import { CriteriaItemModel } from '../../model/CriteriaItemModel';
import { QuestionModel } from '../../model/QuestionModel';
import { SurveyFormFlowUdoModel } from '../../model/SurveyFormFlowUdoModel';
import { QuestionItemType } from '../../model/QuestionItemType';
import { CriterionQuestionItems } from '../../model/CriterionQuestionItems';
import { ChoiceQuestionItems } from '../../model/ChoiceQuestionItems';
import { EssayQuestionItems } from '../../model/EssayQuestionItems';
import { DateQuestionItems } from '../../model/DateQuestionItems';
import { BooleanQuestionItems } from '../../model/BooleanQuestionItems';
import { MatrixQuestionItems } from '../../model/MatrixQuestionItems';
import { NumberValue } from '../../model/NumberValue';
import { SurveyFormQueryModel } from '../../model/SurveyFormQueryModel';

@autobind
export default class SurveyFormService {
  //
  static instance: SurveyFormService;

  surveyFormApi: SurveyFormApi;

  @observable
  surveyForm: SurveyFormModel = new SurveyFormModel();

  @observable
  commonSurveyForm: SurveyFormModel = new SurveyFormModel();

  @computed
  get computedSurveyForm() {
    return this.surveyForm;
  }

  @computed
  get questions() {
    return this.surveyForm.questions;
  }

  @observable
  surveyForms: SurveyFormModel[] = [];

  @observable
  surveyFormsList: OffsetElementList<SurveyFormModel> = {
    results: [],
    totalCount: 0,
  };

  @observable
  surveyFormQuery: SurveyFormQueryModel = new SurveyFormQueryModel();

  @observable
  surveyFormIdSet: string = '';

  @observable
  copySurveyModalOpen: boolean = false;

  constructor(surveyFormApi: SurveyFormApi) {
    //
    this.surveyFormApi = surveyFormApi;
  }

  @action
  async findSurveyForm(surveyFormId: string) {
    //
    if (surveyFormId === '') return new SurveyFormModel();

    const surveyForm = await this.surveyFormApi.findSurveyForm(surveyFormId);
    runInAction(() => {
      this.surveyForm = new SurveyFormModel(surveyForm);
    });

    return this.surveyForm;
  }

  @action
  clear() {
    //
    this.surveyForm = new SurveyFormModel();
  }

  @action
  async registerSurveyForm() {
    const surveyFormFlowCdoModel = SurveyFormModel.asFlowCdo(this.surveyForm);
    return this.surveyFormApi.registerSurveyForm(surveyFormFlowCdoModel);
  }

  @action
  async findSurveyForms(orderedOffset: OrderedOffset | undefined) {
    //삭제
    if (!orderedOffset) return;
    const surveyForms = await this.surveyFormApi
      .findSurveyForms({}, orderedOffset)
      .then((surveyForms) => surveyForms.map((surveyForm) => new SurveyFormModel(surveyForm)));
    runInAction(() => (this.surveyForms = surveyForms));
  }

  @action
  async findAllSurveyFormsByQuery() {
    const surveyForms = await this.surveyFormApi.findSurveyFormsByQuery(
      SurveyFormQueryModel.asSurveyRdo(this.surveyFormQuery)
    );

    runInAction(
      () =>
        (this.surveyFormsList = {
          results:
            (surveyForms &&
              surveyForms.results &&
              surveyForms.results.length &&
              surveyForms.results.map((result) => new SurveyFormModel(result))) ||
            [],
          totalCount: surveyForms && surveyForms.totalCount && surveyForms.totalCount,
        })
    );
    return surveyForms;
  }

  @action
  async removeSurveyForm(surveyFormId: string) {
    return this.surveyFormApi.removeSurveyForm(surveyFormId);
  }

  @action
  clearSurveyFormQueryProps() {
    //
    this.surveyFormQuery = new SurveyFormQueryModel();
  }

  @action
  changeSurveyFormQuestionProps(question: QuestionModel, name: string, value: string | {} | string[]) {
    question = _.set(question, name, value);
  }

  @action
  async copySurveyForm() {
    const surveyFormFlowCdoModel = SurveyFormModel.asFlowCdo(this.surveyForm);
    return this.surveyFormApi.copySurveyForm(this.getSurveyFormIdSet, surveyFormFlowCdoModel);
  }

  /*
  @action
  async findSurveyFormsByDesignState(designState: DesignState, orderedOffset: OrderedOffset) {
    if (!orderedOffset) return;
    const surveyForms = await this.surveyFormApi.findSurveyFormsByDesignState({}, designState, orderedOffset)
      .then((surveyForms) => surveyForms.map((surveyForm) => new SurveyFormModel(surveyForm)));
    runInAction(() => this.surveyForms = surveyForms);
  }
  */

  @action
  async modifySurveyForm() {
    //
    const questions =
      (this.surveyForm.questions &&
        this.surveyForm.questions.length &&
        this.surveyForm.questions.map((question) => ({
          questionId: question.id,
          nameValues: QuestionModel.getNameValueList(question),
        }))) ||
      [];
    const surveyFormFlowUdo: SurveyFormFlowUdoModel = {
      surveyFormNameValues: SurveyFormModel.getNameValueList(this.surveyForm),
      questions,
    };
    return this.surveyFormApi.modifySurveyForm(this.surveyForm.id, surveyFormFlowUdo);
  }

  @action
  addNewCriterion() {
    const criterion = new CriterionModel();
    criterion.number = `${this.surveyForm.criterionList.length + 1}`;
    this.surveyForm.criterionList.push(criterion);
  }

  @action
  confirmSurveyForm() {
    //
    this.surveyFormApi.confirmSurveyForm(this.surveyForm.id);
  }

  @action
  clearSurveyFormProps() {
    //
    this.surveyForm = new SurveyFormModel();
  }

  @action
  changeCopySurveyModalOpen(open: boolean) {
    //
    this.copySurveyModalOpen = open;
  }

  @action
  async arrangeQuestionSequence(index: number, targetIndex: number) {
    if (targetIndex === -1 || targetIndex === this.surveyForm.questions.length) {
      return;
    }

    let sourceQuestion = this.surveyForm.questions[index];
    let targetQuestion = this.surveyForm.questions[targetIndex];
    const sourceSequence = { ...sourceQuestion.sequence };
    const targetSequence = { ...targetQuestion.sequence };

    sourceQuestion = _.set(sourceQuestion, 'sequence', targetSequence);
    targetQuestion = _.set(targetQuestion, 'sequence', sourceSequence);

    this.surveyForm.questions[index] = targetQuestion;
    this.surveyForm.questions[targetIndex] = sourceQuestion;
  }

  @action
  countAllSurveyForms() {
    return this.surveyFormApi.countAllSurveyForms();
  }

  @action
  addQuestion(questionItemType: QuestionItemType) {
    //
    const question = new QuestionModel();
    switch (questionItemType) {
      case QuestionItemType.Criterion:
        question.answerItems = new CriterionQuestionItems();
        break;
      case QuestionItemType.Choice:
        question.answerItems = new ChoiceQuestionItems();
        break;
      case QuestionItemType.Essay:
        question.answerItems = new EssayQuestionItems();
        break;
      case QuestionItemType.Date:
        question.answerItems = new DateQuestionItems();
        break;
      case QuestionItemType.Boolean:
        question.answerItems = new BooleanQuestionItems();
        break;
      case QuestionItemType.Matrix:
        question.answerItems = new MatrixQuestionItems();
        break;
      case QuestionItemType.Review:
        question.answerItems = new ReviewQuestionItems();
        break;
      case QuestionItemType.ChoiceFixed:
        question.answerItems = new ChoiceFixedQuestionItems();
        break;
    }
    question.questionItemType = questionItemType;
    const questions = [...this.surveyForm.questions, question];
    this.surveyForm = _.set(this.surveyForm, 'questions', questions);
  }

  @action
  removeQuestion(index: number) {
    (this.surveyForm.questions as any).remove(this.surveyForm.questions[index]);
  }

  @action
  copyQuestion(question: QuestionModel, index: number) {
    //
    const clonedQuestion = new QuestionModel(toJS(question));
    clonedQuestion.id = '';
    this.surveyForm.questions.push(clonedQuestion);
  }

  @action
  removeAnswerItem(index: number, removedItem: NumberValue) {
    const question = { ...this.surveyForm.questions[index] };
    if (question) {
      const answerItems = question.answerItems as ChoiceQuestionItems;
      const newItems = answerItems.items
        .filter((item) => item.number !== removedItem.number)
        .map((item, index) => {
          item.number = `${index + 1}`;
          return item;
        });
      const newImageUrls = answerItems.imageUrls
        .filter((imageUrl) => imageUrl.number !== removedItem.number)
        .map((imageUrl, index) => {
          imageUrl.number = `${index + 1}`;
          return imageUrl;
        });

      this.surveyForm.questions[index] = _.set(this.surveyForm.questions[index], 'answerItems.items', newItems);

      this.surveyForm.questions[index] = _.set(this.surveyForm.questions[index], 'answerItems.imageUrls', newImageUrls);
    }
  }

  @action
  removeRowItem(index: number, removedItem: NumberValue) {
    const question = { ...this.surveyForm.questions[index] };
    if (question) {
      const matrixItems = question.answerItems as MatrixQuestionItems;
      const newItems = matrixItems.rowItems
        .filter((item) => item.number !== removedItem.number)
        .map((item, index) => {
          item.number = `${index + 1}`;
          return item;
        });

      this.surveyForm.questions[index] = _.set(this.surveyForm.questions[index], 'answerItems.rowItems', newItems);
    }
  }

  @action
  removeColumnItem(index: number, removedItem: NumberValue) {
    const question = { ...this.surveyForm.questions[index] };
    if (question) {
      const matrixItems = question.answerItems as MatrixQuestionItems;
      const newItems = matrixItems.columnItems
        .filter((item) => item.number !== removedItem.number)
        .map((item, index) => {
          item.number = `${index + 1}`;
          return item;
        });

      this.surveyForm.questions[index] = _.set(this.surveyForm.questions[index], 'answerItems.columnItems', newItems);
    }
  }

  @action
  changeSurveyFormProp(prop: keyof SurveyFormModel, value: any) {
    this.surveyForm = _.set(this.surveyForm, prop, value);
  }

  @action
  changeSurveyFormLangStringProp(prop: string, lang: string, string: string) {
    const langStringMap = this.surveyForm.titles.langStringMap;
    langStringMap.set(lang, string);
    this.surveyForm = _.set(this.surveyForm, `${prop}.langStringMap`, langStringMap);
  }

  @action
  changeQuestionProp(index: number, prop: string, value: any) {
    this.surveyForm.questions[index] = _.set(this.surveyForm.questions[index], prop, value);
  }

  @action
  changeQuestionLangString(index: number, prop: string, lang: string, string: string) {
    const langStringMap = _.get(this.surveyForm.questions[index], `${prop}.langStringMap`);
    langStringMap.set(lang, string);
    this.surveyForm.questions[index] = _.set(this.surveyForm.questions[index], `${prop}.langStringMap`, langStringMap);
  }

  @action
  changeCriterionProp(number: string, prop: string, value: any) {
    let criterion = this.surveyForm.criterionList.find((criterion) => criterion.number === number);
    if (!criterion) return;
    criterion = _.set(criterion, prop, value);
    this.surveyForm.criterionList = [...this.surveyForm.criterionList];
  }

  @action
  changeCriterionLangString(number: string, prop: string, lang: string, string: string) {
    let criterion = this.surveyForm.criterionList.find((criterion) => criterion.number === number);
    if (criterion) {
      const langStringMap = _.get(criterion, `${prop}.langStringMap`);
      langStringMap.set(lang, string);
      criterion = _.set(criterion, `${prop}.langStringMap`, langStringMap);
      this.surveyForm.criterionList = [...this.surveyForm.criterionList];
    }
  }

  @action
  calculateCriterionItems(number: string) {
    let criterion = this.surveyForm.criterionList.find((criterion) => criterion.number === number);
    if (!criterion || !CriterionModel.checkValidation('all', criterion)) return;

    const minValue = criterion.minValue;
    const maxValue = criterion.maxValue;
    const increase = criterion.increase;
    const beforeCriteriaItems = criterion.criteriaItems;

    const criteriaItems = [];
    let index = 0;
    let i = 0;
    for (i = minValue; i <= maxValue; i += increase) {
      let criteriaItem = new CriteriaItemModel();
      if (beforeCriteriaItems && beforeCriteriaItems.length && beforeCriteriaItems.length >= i) {
        criteriaItem = beforeCriteriaItems[index];
      } else {
        criteriaItem.names.defaultLanguage = 'ko';
        criteriaItem.index = index;
        criteriaItem.value = i;
      }

      criteriaItems.push(criteriaItem);
      index++;

      if (i + increase > maxValue) break;
    }

    criterion = _.set(criterion, 'criteriaItems', criteriaItems);
    this.surveyForm.criterionList = [...this.surveyForm.criterionList];
  }

  @action
  setSurveyForm(surveyForm: SurveyFormModel) {
    this.surveyForm = surveyForm;
  }

  @action
  changeSurveyFormQueryProp(name: string, value: any) {
    if (value === '전체') value = '';
    this.surveyFormQuery = _.set(this.surveyFormQuery, name, value);
  }

  copySurveyModalShow(surveyFormIdSet: string) {
    //
    this.changeCopySurveyModalOpen(true);
    this.surveyFormIdSet = surveyFormIdSet;
  }

  @computed
  get getSurveyFormIdSet() {
    return this.surveyFormIdSet;
  }

  @action
  changeCommonSurveyFormProps() {
    //
    this.commonSurveyForm = this.surveyForm;
  }

  @observable
  surveyCommentId: string = '';

  @action
  setSurveyCommentId(surveyCommentId: string) {
    //
    this.surveyCommentId = surveyCommentId;
  }
}

Object.defineProperty(SurveyFormService, 'instance', {
  value: new SurveyFormService(SurveyFormApi.instance),
  writable: false,
  configurable: false,
});
