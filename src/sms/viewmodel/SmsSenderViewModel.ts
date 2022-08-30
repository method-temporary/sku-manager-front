import { PolyglotModel } from 'shared/model';

export interface SmsSenderSearchBoxViewModel {
  allowed: string;
  keywordType: string;
  keyword: string;
}

export function initSmsSenderSearchBoxViewModel(): SmsSenderSearchBoxViewModel {
  return {
    allowed: '',
    keywordType: '',
    keyword: '',
  };
}

export interface SmsSenderListViewModel {
  results: SmsSenderListItemModel[];
  totalCount: number;
}

export interface SmsSenderListItemModel {
  id: string;
  companyName?: PolyglotModel;
  departmentName?: PolyglotModel;
  name: string;
  email: string;
  allowed: boolean;
  phone: string;
}
export interface SmsSenderXlsModel {
  '소속사 (Ko)': string;
  '소속사 (En)': string;
  '소속사 (Zh)': string;
  '소속 조직(팀) (Ko)': string;
  '소속 조직(팀) (En)': string;
  '소속 조직(팀) (Zh)': string;
  성명: string;
  'E-mail': string;
  전화번호: string;
  'SMS 발송권한': string;
}
export function asSmsSenderXLSX(sender: SmsSenderListItemModel) {
  const xlsModel: SmsSenderXlsModel = {
    '소속사 (Ko)': sender.companyName?.ko || '',
    '소속사 (En)': sender.companyName?.en || '',
    '소속사 (Zh)': sender.companyName?.zh || '',
    '소속 조직(팀) (Ko)': sender.departmentName?.ko || '',
    '소속 조직(팀) (En)': sender.departmentName?.en || '',
    '소속 조직(팀) (Zh)': sender.departmentName?.zh || '',
    성명: sender.name,
    'E-mail': sender.email,
    전화번호: sender.phone,
    'SMS 발송권한': sender.allowed ? 'Y' : 'N',
  };
  return xlsModel;
}
