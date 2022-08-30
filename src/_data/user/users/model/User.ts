import PolyglotString from 'shared/model/PolyglotString';

export interface User {
  id: string;
  name: PolyglotString;
  email: string;
  phone: string;
  employeeId: string;
  companyCode: string;
  companyName: PolyglotString;
  departmentCode: string;
  departmentName: PolyglotString;
  duty: string;
  gender: string;
  birthDate?: string;
  language: string;
  nickname: string;
  displayNicknameFirst: boolean;
  backgroundImagePath: string;
  selfIntroduction: string;
  signedDate: number;
  photoImagePath: string;
  gdiPhotoImagePath: string;
  useGdiPhoto: boolean;
  membershipManagedManually: boolean;
  userGroupSequences: {
    sequences: number[];
  };
  registeredTime: number;
  modifiedTime: number;
  modifier: string;
}
