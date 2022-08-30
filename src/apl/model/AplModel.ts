import { computed, decorate, observable } from 'mobx';
import moment from 'moment';

import { PolyglotModel, QueryModel } from 'shared/model';
import { ALL_LANGUAGES, LangSupport } from 'shared/components/Polyglot';

import { AplUdoModel } from './AplUdoModel';
import { UserIdentityModel } from '../../cube/user/model/UserIdentityModel';

export class AplModel extends QueryModel {
  //
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
  cineroomId: string = '';
  collegeId: string = '';
  content: string = '';
  endDate: number = 0;
  fileIds: string = '';
  id: string = '';
  institute: string = '';
  modifiedTime: number = 0;
  modifierEmail: string = '';
  modifierName: string = '';
  patronKeyString: string = '';
  patronType: string = '';
  pavilionId: string = '';
  registeredTime: number = 0;
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

  // requiredSubsidiaries: IdName[] = [];
  langSupports: LangSupport[] = ALL_LANGUAGES;

  constructor(aplModel?: AplModel) {
    super();
    if (aplModel) {
      // let tag = '';
      // if (apl.tags) apl.tags.forEach(tags => tag = `${tag ? `${tag},${tags}` : tags}`);
      const registrantUserIdentity = new UserIdentityModel(aplModel.registrantUserIdentity);
      const approvalName = new PolyglotModel(aplModel.approvalName);
      const approvalCompany = new PolyglotModel(aplModel.approvalCompany);
      const approvalDepartment = new PolyglotModel(aplModel.approvalDepartment);

      Object.assign(this, {
        ...aplModel,
        registrantUserIdentity,
        approvalName,
        approvalCompany,
        approvalDepartment,
      });
    }
  }

  @computed
  get getTime() {
    //
    return moment(this.registeredTime).format('YYYY.MM.DD HH:mm:ss');
  }

  @computed
  get allowUpdateHour() {
    if (this.updateHour === 0 && this.updateMinute === 0) return this.allowHour;
    return this.updateHour;
  }

  @computed
  get allowUpdateMinute() {
    if (this.updateHour === 0 && this.updateMinute === 0) return this.allowMinute;
    return this.updateMinute;
  }

  static isBlank(aplModel: AplModel): string {
    /*if (!aplModel.updateHour) return '교육시간(시)';
    if (!aplModel.updateMinute) return '교육시간(minute(s))';*/
    if (Number(aplModel.updateHour) === 0 && Number(aplModel.updateMinute) === 0) return '교육시간';
    // if (aplModel.subsidiaries.length === 0) return '관계사 공개 범위 설정';
    return 'success';
  }

  static asUdo(aplModel: AplModel): AplUdoModel {
    //
    return {
      allowHour: aplModel.allowHour,
      allowMinute: aplModel.allowMinute,
      allowTime: aplModel.allowTime,
      approvalCompany: aplModel.approvalCompany || '',
      approvalDepartment: aplModel.approvalDepartment || '',
      approvalEmail: aplModel.approvalEmail,
      approvalId: aplModel.approvalId || '',
      approvalName: aplModel.approvalName || '',
      approvalYn: aplModel.approvalYn || false,
      causeOfReturn: aplModel.causeOfReturn || '',
      channelId: aplModel.channelId,
      collegeId: aplModel.collegeId,
      content: aplModel.content,
      endDate: aplModel && aplModel.period && aplModel.period.endDateLong,
      fileIds: aplModel.fileIds || '',
      id: aplModel.id,
      institute: aplModel.institute,
      modifiedTime: aplModel.modifiedTime,
      modifierEmail: aplModel.modifierEmail,
      modifierName: aplModel.modifierName,
      registrantUserIdentity: aplModel.registrantUserIdentity,
      requestHour: aplModel.requestHour,
      requestMinute: aplModel.requestMinute,
      startDate: aplModel && aplModel.period && aplModel.period.startDateLong,
      state: aplModel.state,
      title: aplModel.title,
      type: aplModel.type,
      typeName: aplModel.typeName,
      updateHour: aplModel.updateHour,
      updateMinute: aplModel.updateMinute,
    };
  }
}

decorate(AplModel, {
  title: observable,
  type: observable,
  typeName: observable,
  channelId: observable,
  startDate: observable,
  endDate: observable,
  institute: observable,
  requestHour: observable,
  requestMinute: observable,
  allowHour: observable,
  allowMinute: observable,
  updateHour: observable,
  updateMinute: observable,
  content: observable,
  state: observable,
  registeredTime: observable,
  registrantUserIdentity: observable,
  fileIds: observable,
  approvalYn: observable,
  approvalId: observable,
  approvalName: observable,
  modifierEmail: observable,
  modifierName: observable,
  modifiedTime: observable,
  causeOfReturn: observable,
  approvalCompany: observable,
  approvalDepartment: observable,
  allowTime: observable,
});
