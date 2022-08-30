import { PolyglotModel } from '../../../../shared/model';

export interface User {
  name: PolyglotModel;
  email: string;
  phone: string;
  employeeId: string;
  companyCode: string;
  companyName: PolyglotModel;
  departmentCode: string;
  departmentName: PolyglotModel;
  duty: string;
  gender: string;
  birthDate: string;
  language: string;
  nickname: string;
  displayNicknameFirst: boolean;
  backgroundImagePath: string;
  selfIntroduction: string;
  signedDate: number;
  photoImagePath: string;
  gdiPhotoImagePath: string;
  useGdiPhoto: boolean;
  userGroupSequences: string;
  registeredTime: number;
  modifiedTime: number;
}

export function getInitUser() {
  //
  return {
    name: new PolyglotModel(),
    email: '',
    phone: '',
    employeeId: '',
    companyCode: '',
    companyName: new PolyglotModel(),
    departmentCode: '',
    departmentName: new PolyglotModel(),
    duty: '',
    gender: '',
    birthDate: '',
    language: '',
    nickname: '',
    displayNicknameFirst: false,
    backgroundImagePath: '',
    selfIntroduction: '',
    signedDate: 0,
    photoImagePath: '',
    gdiPhotoImagePath: '',
    useGdiPhoto: false,
    userGroupSequences: '',
    registeredTime: 0,
    modifiedTime: 0,
  };
}
