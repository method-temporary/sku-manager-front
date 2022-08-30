import { computed, decorate, observable } from 'mobx';
import moment from 'moment';

import { patronInfo } from '@nara.platform/dock';

import { NameValueList, LangStrings, DramaEntityObservableModel } from 'shared/model';
import { DEFAULT_LANGUAGE, getDefaultLanguage, LangSupport, langSupportCdo } from 'shared/components/Polyglot';

import { FormDesignerModel } from './FormDesignerModel';
import { DesignState } from './DesignState';
import { QuestionPathModel } from './QuestionPathModel';
import { CriterionModel } from './CriterionModel';
import { QuestionGroupModel } from './QuestionGroupModel';
import { QuestionModel } from './QuestionModel';
import { SuggestionModel } from './SuggestionModel';
import SurveyFormFlowCdoModel from './SurveyFormFlowCdoModel';
import { QuestionFlowCdoModel } from './QuestionFlowCdoModel';
import { QuestionItemType } from './QuestionItemType';

export class SurveyFormModel extends DramaEntityObservableModel {
  //
  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];
  titles: LangStrings = new LangStrings();
  managementNumber: string = '';
  formDesigner: FormDesignerModel = new FormDesignerModel();
  description: string = '';
  time: number = 0;
  designState: DesignState = DesignState.Draft;
  confirmTime: number = 0;
  supportedLanguages: string[] = [];
  questionPath: QuestionPathModel = new QuestionPathModel();
  criterionList: CriterionModel[] = [];
  questionGroups: QuestionGroupModel[] = [];
  questions: QuestionModel[] = [];
  suggestions: SuggestionModel[] = [];
  useCommon: boolean = false;
  userViewResult: boolean = false;

  //UI
  selectedCriterion: CriterionModel = new CriterionModel();

  constructor(surveyForm?: SurveyFormModel) {
    //
    super();
    if (surveyForm) {
      const titles = (surveyForm.titles && new LangStrings(surveyForm.titles)) || this.titles;
      const formDesigner =
        (surveyForm.formDesigner && new FormDesignerModel(surveyForm.formDesigner)) || this.formDesigner;
      const questionPath =
        (surveyForm.questionPath && new QuestionPathModel(surveyForm.questionPath)) || this.questionPath;
      const langSupports = surveyForm.langSupports.map((target) => new LangSupport(target));
      Object.assign(this, { ...surveyForm, titles, formDesigner, questionPath, langSupports });
      this.questions =
        (surveyForm.questions &&
          surveyForm.questions.length &&
          surveyForm.questions.map((question) => new QuestionModel(question))) ||
        this.questions;
      this.criterionList =
        (surveyForm.criterionList &&
          surveyForm.criterionList.length &&
          surveyForm.criterionList.map((criterion) => new CriterionModel(criterion))) ||
        this.criterionList;
      this.questionGroups =
        (surveyForm.questionGroups &&
          surveyForm.questionGroups.length &&
          surveyForm.questionGroups.map((questionGroup) => new QuestionGroupModel(questionGroup))) ||
        this.questionGroups;
      this.suggestions =
        (surveyForm.suggestions &&
          surveyForm.suggestions.length &&
          surveyForm.suggestions.map((suggestion) => new SuggestionModel(suggestion))) ||
        this.suggestions;
    }
  }

  @computed
  get title(): string {
    return (
      (this.titles && this.titles.langStringMap && this.titles.langStringMap.get(this.titles.defaultLanguage)) || ''
    );
  }

  @computed
  get formDesignerName(): string {
    return (
      (this.formDesigner &&
        this.formDesigner.names &&
        this.formDesigner.names.langStringMap.get(this.formDesigner.names.defaultLanguage)) ||
      ''
    );
  }

  @computed
  get timeStr(): string {
    return (this.time && moment(this.time).format('YYYY.MM.DD')) || '';
  }

  @computed
  get designStateName() {
    switch (this.designState) {
      case DesignState.Confirmed:
        return '확정';
      case DesignState.Draft:
        return '임시저장';
      default:
        return '설문진행';
    }
  }

  static getNameValueList(surveyForm: SurveyFormModel) {
    const nameValues = [];
    nameValues.push({ name: 'managementNumber', value: surveyForm.managementNumber });
    nameValues.push({ name: 'titles', value: JSON.stringify(surveyForm.titles) });
    nameValues.push({ name: 'langSupports', value: JSON.stringify(langSupportCdo(surveyForm.langSupports)) });
    nameValues.push({ name: 'formDesigner', value: JSON.stringify(surveyForm.formDesigner) });
    nameValues.push({ name: 'description', value: surveyForm.description });
    nameValues.push({ name: 'supportedLanguages', value: JSON.stringify(surveyForm.supportedLanguages) });
    nameValues.push({ name: 'designState', value: surveyForm.designState });
    nameValues.push({ name: 'questionPath', value: JSON.stringify(surveyForm.questionPath) });
    nameValues.push({ name: 'criterionList', value: JSON.stringify(surveyForm.criterionList) });
    nameValues.push({ name: 'useCommon', value: surveyForm.useCommon });
    nameValues.push({ name: 'userViewResult', value: surveyForm.userViewResult });

    return { nameValues } as NameValueList;
  }

  static asFlowCdo(surveyForm: SurveyFormModel): SurveyFormFlowCdoModel {
    //
    surveyForm.titles.defaultLanguage = getDefaultLanguage(surveyForm.langSupports);
    surveyForm.questions.forEach((question) => {
      if (question.questionItemType === QuestionItemType.Choice) {
        Array.from((question.answerItems as any).items).forEach((nameValues) => {
          (nameValues as any).values.defaultLanguage = getDefaultLanguage(surveyForm.langSupports);
        });
      } else if (question.questionItemType === QuestionItemType.Matrix) {
        Array.from((question.answerItems as any).rowItems).forEach((nameValues) => {
          (nameValues as any).values.defaultLanguage = getDefaultLanguage(surveyForm.langSupports);
        });
        Array.from((question.answerItems as any).columnItems).forEach((nameValues) => {
          (nameValues as any).values.defaultLanguage = getDefaultLanguage(surveyForm.langSupports);
        });
      }
    });

    const questions: QuestionFlowCdoModel[] =
      (surveyForm.questions &&
        surveyForm.questions.length &&
        surveyForm.questions.map((question) => QuestionModel.asFlowCdo(question))) ||
      [];
    return {
      langSupports: langSupportCdo(surveyForm.langSupports),
      titles: surveyForm.titles,
      email: patronInfo.getPatronEmail() || '',
      name: JSON.parse(patronInfo.getPatronName() || '')?.ko || '',
      usid: '',
      company: patronInfo.getPatronCompanyCode() || '',
      designState: surveyForm.designState,
      criterionList: surveyForm.criterionList,
      questions,
      useCommon: surveyForm.useCommon,
      userViewResult: surveyForm.userViewResult,
    };
  }
}

decorate(SurveyFormModel, {
  titles: observable,
  managementNumber: observable,
  formDesigner: observable,
  description: observable,
  time: observable,
  designState: observable,
  confirmTime: observable,
  supportedLanguages: observable,
  questionPath: observable,
  criterionList: observable,
  questionGroups: observable,
  questions: observable,
  langSupports: observable,
  suggestions: observable,
  selectedCriterion: observable,
  useCommon: observable,
  userViewResult: observable,
});
