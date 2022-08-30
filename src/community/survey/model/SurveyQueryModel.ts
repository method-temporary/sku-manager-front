import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import SurveyRdo from './SurveyRdo';

export class SurveyQueryModel extends QueryModel {
  searchFilter: string = '';
  popup: boolean = false;
  precedence: boolean | undefined = false;

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;
  communityId: string = '';
  menuId: string = '';

  surveyCaseId: string = '';
  surveyInformation: string = '';

  static asSurveyRdo(surveyQuery: SurveyQueryModel): SurveyRdo {
    //

    let isMenu = false;
    let isSurveyInformation = false;
    if (surveyQuery.searchPart === '메뉴') isMenu = true;
    if (surveyQuery.searchPart === '설문설명') isSurveyInformation = true;

    return {
      name: (isMenu && surveyQuery && surveyQuery.searchWord) || '',
      surveyInformation: (isSurveyInformation && surveyQuery && surveyQuery.searchWord) || '',
      offset: surveyQuery.offset,
      limit: surveyQuery.limit,
      communityId: surveyQuery.communityId,
      surveyCaseId: surveyQuery.surveyCaseId,
    };
  }
}

decorate(SurveyQueryModel, {
  currentPage: observable,
  communityId: observable,
  surveyCaseId: observable,
  surveyInformation: observable,
  searchWord: observable,
});
