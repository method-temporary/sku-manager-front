import { decorate, observable } from 'mobx';
import { PolyglotModel, DramaEntityObservableModel } from 'shared/model';

export class UserIdentityModel extends DramaEntityObservableModel {
  //
  name: PolyglotModel = new PolyglotModel();
  email: string = '';
  phone: string = '';
  employeeId: string = '';
  companyCode: string = '';
  companyName: PolyglotModel = new PolyglotModel();
  departmentCode: string = '';
  departmentName: PolyglotModel = new PolyglotModel();
  duty: string = '';
  gender: string = '';
  birthDate: string = '';
  language: string = '';
  nickname: string = '';
  displayNicknameFirst: boolean = false;
  backgroundImagePath: string = '';
  selfIntroduction: string = '';
  signedDate: number = 0;
  photoImagePath: string = '';
  gdiPhotoImagePath: string = '';
  useGdiPhoto: boolean = false;
  userGroupSequences: string = '';

  registeredTime: number = 0;
  modifiedTime: number = 0;

  // denizenId: string = '';
  // operatorName: PolyglotModel = new PolyglotModel();
  // operatorGroupName: PolyglotModel = new PolyglotModel();
  // company: PolyglotModel = new PolyglotModel();
  // department: PolyglotModel = new PolyglotModel();
  // operatorId: string = '';

  // titles: LanguageStrings = new LanguageStrings();
  // ranks: LanguageStrings = new LanguageStrings();
  // duties: LanguageStrings = new LanguageStrings();
  //
  // chartDisplayed: boolean = false;
  // displayOrder: string = '';
  // retired: boolean = false;

  constructor(userIdentity?: UserIdentityModel) {
    super();
    if (userIdentity) {
      const name = new PolyglotModel(userIdentity.name);
      const companyName = new PolyglotModel(userIdentity.companyName);
      const departmentName = new PolyglotModel(userIdentity.departmentName);

      // const operatorName = new PolyglotModel(userIdentity.operatorName);
      // const operatorGroupName = new PolyglotModel(userIdentity.operatorGroupName);
      // const company = new PolyglotModel(userIdentity.company);
      // const department = new PolyglotModel(userIdentity.department);
      Object.assign(this, {
        ...userIdentity,
        name,
        companyName,
        departmentName,

        // operatorName,
        // operatorGroupName,
        // company,
        // department,
      });
    }
  }

  // @computed
  // get name() {
  //   // if (this.names && this.names.langStringMap) {
  //   //   return this.names.langStringMap.get(this.names.defaultLanguage) || '';
  //   // }
  //   return getPolyglotToString(this.names);
  // }
  //
  // @computed
  // get company() {
  //   // if (this.companyNames && this.companyNames.langStringMap) {
  //   //   return this.companyNames.langStringMap.get(this.companyNames.defaultLanguage) || '';
  //   // }
  //   return getPolyglotToString(this.companyNames);
  // }
  //
  // @computed
  // get department() {
  //   // if (this.departmentNames && this.departmentNames.langStringMap) {
  //   //   return this.departmentNames.langStringMap.get(this.departmentNames.defaultLanguage) || '';
  //   // }
  //   return getPolyglotToString(this.departmentNames);
  // }
  //
  // @computed
  // get title() {
  //   // if (this.titles && this.titles.langStringMap) {
  //   //   return this.titles.langStringMap.get(this.titles.defaultLanguage) || '';
  //   // }
  //   return getPolyglotToString(this.departmentNames);
  // }
}

decorate(UserIdentityModel, {
  name: observable,
  email: observable,
  phone: observable,
  employeeId: observable,
  companyCode: observable,
  companyName: observable,
  departmentCode: observable,
  departmentName: observable,
  gender: observable,
  birthDate: observable,
  language: observable,
  nickname: observable,
  displayNicknameFirst: observable,
  backgroundImagePath: observable,
  selfIntroduction: observable,
  signedDate: observable,
  photoImagePath: observable,
  gdiPhotoImagePath: observable,
  useGdiPhoto: observable,
  userGroupSequences: observable,
  registeredTime: observable,
  modifiedTime: observable,
  // denizenId: observable,
  // operatorName: observable,
  // operatorGroupName: observable,
  // company: observable,
  // department: observable,
  // operatorId: observable,
});
