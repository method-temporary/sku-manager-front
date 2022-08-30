import { LangStrings } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

import { QuestionFlowCdoModel } from './QuestionFlowCdoModel';
import { DesignState } from './DesignState';
import { CriterionModel } from './CriterionModel';

export default class SurveyFormFlowCdoModel {
  //
  langSupports: LangSupport[] = [];
  titles: LangStrings = new LangStrings();
  email: string = '';
  usid: string = '';
  name: string = '';
  company: string = '';

  designState: DesignState = DesignState.Draft;
  criterionList: CriterionModel[] = [];

  questions: QuestionFlowCdoModel[] = [];

  useCommon: boolean = false;
  userViewResult: boolean = false;
}
