import { PolyglotModel } from '../../shared/model';

export interface SimpleUserIdentity {
  //
  id: string;

  name: PolyglotModel;
  email: string;
  companyCode: string;
  companyName: PolyglotModel;
  departmentCode: string;
  departmentName: PolyglotModel;

  nickname: string;
  displayNicknameFirst: boolean;

  photoImagePath: string;
  gdiPhotoImagePath: string;
  useGdiPhoto: boolean;

  ///
  duty: string;
}
