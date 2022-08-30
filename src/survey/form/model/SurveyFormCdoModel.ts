import { LangString } from '@nara.platform/accent';
import { FormDesignerModel } from './FormDesignerModel';

export default class SurveyFormCdoModel {
  //
  audienceKey: string = '';
  managementNumber: string = '';
  title: LangString = { lang: '', string: '' };
  formDesigner: FormDesignerModel = new FormDesignerModel();
}
