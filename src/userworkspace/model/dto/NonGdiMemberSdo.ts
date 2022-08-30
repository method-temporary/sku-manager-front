import { PolyglotModel } from 'shared/model';

export class NonGdiMemberSdo {
  //
  name: PolyglotModel = new PolyglotModel();
  email: string = '';
  usid: string = '';
  phone: string = '';
  // 김민준 - 다국어 적용시 변경 필요
  // departmentName: PolyglotModel = new PolyglotModel();
  departmentName: string = '';
  citizenId: string = '';
  tempWorkType: null | string = null;

  failedReason: string = '';
  errorMessageCode: string = '';

  constructor(nonGdiMemberSdo?: NonGdiMemberSdo) {
    if (nonGdiMemberSdo) {
      const name = (nonGdiMemberSdo.name && new PolyglotModel(nonGdiMemberSdo.name)) || this.name;
      Object.assign(this, { ...nonGdiMemberSdo, name });
    }
  }
}
