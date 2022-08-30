import { PolyglotModel } from 'shared/model';

import { UserIdentityModel } from '../../cube/user/model/UserIdentityModel';

export class AplUdoModel {
  //
  // audienceKey: string = 'r2p8-r@nea-m5-c5';
  allowHour: number = 0;
  allowMinute: number = 0;
  allowTime: number = 0;
  approvalCompany: PolyglotModel = new PolyglotModel();
  approvalDepartment: PolyglotModel = new PolyglotModel();
  approvalEmail: string = '';
  approvalId: string = '';
  approvalName: PolyglotModel = new PolyglotModel();
  approvalYn: boolean | undefined;
  causeOfReturn: string = '';
  channelId: string = '';
  collegeId: string = '';
  content: string = '';
  endDate: number = 0;
  fileIds: string = '';
  id: string = '';
  institute: string = '';
  modifiedTime: number = 0;
  modifierEmail: string = '';
  modifierName: string = '';
  registrantUserIdentity: UserIdentityModel = new UserIdentityModel();
  requestHour: number = 0;
  requestMinute: number = 0;
  startDate: number = 0;
  state: string = '';
  title: string = '';
  type: string = '';
  typeName: string = '';
  updateHour: number = 0;
  updateMinute: number = 0;
}
