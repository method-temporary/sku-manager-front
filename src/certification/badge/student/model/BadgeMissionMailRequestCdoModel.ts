import { DenizenKey } from '@nara.platform/accent';
import { PatronKey, PolyglotModel } from 'shared/model';

export class BadgeMissionMailRequestCdoModel {
  //
  badgeName: PolyglotModel = new PolyglotModel();
  badgeStudentId: string = '';
  badgeOperatorEmail: string = '';
  badgeOperatorName: PolyglotModel = new PolyglotModel();
  title: string = '';
  contents: PolyglotModel = new PolyglotModel();
  url: string = '';
  operator: DenizenKey = new PatronKey(); // 처리자

  constructor(cdo?: BadgeMissionMailRequestCdoModel) {
    if (cdo) {
      const badgeName = (cdo.badgeName && new PolyglotModel(cdo.badgeName)) || this.badgeName;
      const contents = (cdo.contents && new PolyglotModel(cdo.contents)) || this.contents;

      Object.assign(this, { ...cdo, badgeName, contents });
    }
  }
}
