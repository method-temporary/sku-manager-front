import { PolyglotModel } from 'shared/model';

export interface Sender {
  id: string;
  qualified: boolean;
}

export interface UserWithSmsSender {
  smsSender: Sender;
  user: User;
}

interface User {
  birthDate: string;
  companyCode: string;
  companyName: PolyglotModel;
  departmentCode: string;
  departmentName: PolyglotModel;
  email: string;
  employeeId: string;
  gender: string;
  language: string;
  name: PolyglotModel;
  phone: string;
  signedDate: number;
}
