import { computed, decorate, observable } from 'mobx';
import moment from 'moment';

import { PolyglotModel, DramaEntityObservableModel } from 'shared/model';
import { Language } from 'shared/components/Polyglot';

import { PisAgreementModel } from './PisAgreementModel';
import UserGroupSequenceModel from '../../usergroup/group/model/UserGroupSequenceModel';

export class UserModel extends DramaEntityObservableModel {
  //
  name: PolyglotModel = new PolyglotModel();
  phone: string = '';
  employeeId: string = '';
  companyCode: string = '';
  companyName: PolyglotModel = new PolyglotModel();
  departmentCode: string = '';
  departmentName: PolyglotModel = new PolyglotModel();
  email: string = '';

  language: Language = Language.English;
  gdiPhotoImagePath: string = '';
  useGdiPhoto: boolean = false;
  nickname: string = '';
  displayNicknameFirst: boolean = false;
  backgroundImagePath: string = '';
  selfIntroduction: string = '';
  photoImagePath: string = '';

  pisAgreement: PisAgreementModel = new PisAgreementModel();
  signedDate: string = '';
  registeredTime: number = 0;
  userGroupSequences: UserGroupSequenceModel = new UserGroupSequenceModel();

  gender: string = '';
  birthDate: string = '';

  photoImage: string = ''; //mySUNI 로부터 사용자가 등록한 증명사진 이미지 base64 값
  checked: boolean = false;

  constructor(user?: UserModel) {
    //
    super();

    if (user) {
      const patronKey = user.patronKey || this.patronKey;
      const pisAgreement = (user.pisAgreement && new PisAgreementModel(user.pisAgreement)) || this.pisAgreement;

      const name = (user.name && new PolyglotModel(user.name)) || this.name;
      const companyName = (user.companyName && new PolyglotModel(user.companyName)) || this.companyName;
      const departmentName = (user.departmentName && new PolyglotModel(user.departmentName)) || this.departmentName;
      const userGroupSequences = user.userGroupSequences || new UserGroupSequenceModel();

      Object.assign(this, { ...user, patronKey, pisAgreement, name, companyName, departmentName, userGroupSequences });
    }
  }

  @computed
  get getSignedDate() {
    if (this.signedDate) {
      return new Date(this.signedDate).toISOString().slice(0, 10);
    }
    return '';
  }

  @computed
  get photoFilePath() {
    //
    let photoImageFilePath: string = '';

    // GDI Img
    if (this.useGdiPhoto) {
      photoImageFilePath = this.gdiPhotoImagePath;
    } else {
      photoImageFilePath = this.photoImagePath;
    }
    return photoImageFilePath;
  }

  @computed
  get getCreationTime() {
    //
    let creationTime = '미가입';

    if (this.registeredTime !== 0) {
      creationTime = moment(this.registeredTime).format('yyyy-MM-DD');
    }
    return creationTime;
  }
}

decorate(UserModel, {
  name: observable,
  phone: observable,
  employeeId: observable,
  companyName: observable,
  departmentCode: observable,
  departmentName: observable,
  email: observable,
  gdiPhotoImagePath: observable,
  useGdiPhoto: observable,
  nickname: observable,
  displayNicknameFirst: observable,
  backgroundImagePath: observable,
  selfIntroduction: observable,
  photoImagePath: observable,
  registeredTime: observable,
  pisAgreement: observable,
  signedDate: observable,
  userGroupSequences: observable,
  gender: observable,
  birthDate: observable,
  photoImage: observable,
  checked: observable,
});
