import { PolyglotString } from 'shared/model';

export interface AutoEncourageExcludedStudentQdo {
  id: string;
  companyName: PolyglotString;
  departmentName: PolyglotString;
  duty: string;
  email: string;
  name: PolyglotString;
  registeredTime: number;
  registrant: string;
  registrantName: PolyglotString;
}

export interface AutoEncourageExcludedStudentParams {
  cardId: string;
  name: string;
  email: string;
  limit: number;
  offset: number;
}

export interface AutoEncourageExcludedStudentCdos {
  cardId: string;
  email: string;
}
