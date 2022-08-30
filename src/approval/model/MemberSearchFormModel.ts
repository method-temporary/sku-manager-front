import { MemberSearchType } from './vo';

export default interface MemberSearchFormModel {
  companyCode: string;
  startDate: number;
  endDate: number;
  searchPart: MemberSearchType;
  searchWord: string;

  limit: number;
  offset: number;
}

export const getInitMemberSearchFormModel = (): MemberSearchFormModel => ({
  companyCode: '',
  startDate: 0,
  endDate: 0,
  searchPart: MemberSearchType.Default,
  searchWord: '',

  limit: 20,
  offset: 0,
});
