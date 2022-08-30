import { PolyglotModel } from '../../shared/model';
import { Language } from './Language';
import { UserGroupSequences } from './UserGroupSequences';

export interface UserIdentity {
  backgroundImagePath: string;
  birthYear: string;
  companyCode: string;
  companyName: PolyglotModel;
  departmentCode: string;
  departmentName: PolyglotModel;
  displayNicknameFirst: boolean;
  duty: string;
  email: string;
  employeeId: string;
  gdiPhotoImagePath: string;
  gender: number;
  id: string;
  language: Language;
  modifiedTime: number;
  modifier: string;
  name: PolyglotModel;
  nickname: string;
  phone: string;
  photoImagePath: string;
  registeredTime: number;
  selfIntroduction: string;
  signedDate: number;
  useGdiPhoto: boolean;
  userGroupSequences: UserGroupSequences[];
}
