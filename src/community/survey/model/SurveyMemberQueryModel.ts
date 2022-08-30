import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import SurveyMemberRdo from './SurveyMemberRdo';

export class SurveyMemberQueryModel extends QueryModel {
  searchFilter: string = '';

  name: string = '';
  companyName: string = '';
  teamName: string = '';
  email: string = '';

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;

  communityId: string = '';
  surveyCaseId: string = '';

  static asSurveyMemberRdo(surveyMemberQuery: SurveyMemberQueryModel): SurveyMemberRdo {
    //
    let isCompanyName = false;
    let isTeamName = false;
    let isName = false;
    let isEmail = false;
    if (surveyMemberQuery.searchPart === '소속사') isCompanyName = true;
    if (surveyMemberQuery.searchPart === '소속조직(팀)') isTeamName = true;
    if (surveyMemberQuery.searchPart === '성명') isName = true;
    if (surveyMemberQuery.searchPart === 'E-mail') isEmail = true;

    return {
      companyName: (isCompanyName && surveyMemberQuery && surveyMemberQuery.searchWord) || '',
      teamName: (isTeamName && surveyMemberQuery && surveyMemberQuery.searchWord) || '',
      name: (isName && surveyMemberQuery && surveyMemberQuery.searchWord) || '',
      email: (isEmail && surveyMemberQuery && surveyMemberQuery.searchWord) || '',

      offset: surveyMemberQuery.offset,
      limit: surveyMemberQuery.limit,
      communityId: surveyMemberQuery.communityId,
      surveyCaseId: surveyMemberQuery.surveyCaseId,
    };
  }
}

decorate(SurveyMemberQueryModel, {
  currentPage: observable,
  page: observable,
  pageIndex: observable,
  name: observable,
  companyName: observable,
  teamName: observable,
  email: observable,
});
