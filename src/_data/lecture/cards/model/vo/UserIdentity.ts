import { PolyglotString } from 'shared/model';
import { UserGroupSequenceModel } from 'usergroup/group/model';

export interface UserIdentity {
  backgroundImagePath: string;
  birthYear: string;
  companyCode: string;
  companyName: PolyglotString;
  departmentCode: string;
  departmentName: PolyglotString;
  displayNicknameFirst: boolean;
  duty: string;
  email: string;
  employeeId: string;
  gdiPhotoImagePath: string;
  gender: number;
  id: string;
  language: string;
  modifiedTime: number;
  modifier: string;
  name: PolyglotString;
  nickname: string;
  phone: string;
  photoImagePath: string;
  registeredTime: number;
  selfIntroduction: string;
  signedDate: number;
  useGdiPhoto: boolean;
  userGroupSequences: UserGroupSequenceModel;
}
