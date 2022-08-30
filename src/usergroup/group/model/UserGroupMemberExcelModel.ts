import UserGroupMemberModel from './UserGroupMemberModel';

export default class UserGroupMemberExcelModel {
  //
  '사번': string;
  '성명(Ko)': string;
  '성명(En)': string;
  '성명(Zh)': string;
  'E-mail': string;
  '소속회사(Ko)': string;
  '소속회사(En)': string;
  '소속회사(Zh)': string;
  '소속부서명(Ko)': string;
  '소속부서명(En)': string;
  '소속부서명(Zh)': string;
  '가입일자': string;

  constructor(userGroupMember?: UserGroupMemberModel) {
    if (userGroupMember) {
      this['사번'] = userGroupMember.memberView.employeeId;
      this['성명(Ko)'] = userGroupMember.memberView.name.ko;
      this['성명(En)'] = userGroupMember.memberView.name.en;
      this['성명(Zh)'] = userGroupMember.memberView.name.zh;
      this['E-mail'] = userGroupMember.memberView.email;
      this['소속회사(Ko)'] = userGroupMember.memberView.companyName.ko;
      this['소속회사(En)'] = userGroupMember.memberView.companyName.en;
      this['소속회사(Zh)'] = userGroupMember.memberView.companyName.zh;
      this['소속부서명(Ko)'] = userGroupMember.memberView.departmentName.ko;
      this['소속부서명(En)'] = userGroupMember.memberView.departmentName.en;
      this['소속부서명(Zh)'] = userGroupMember.memberView.departmentName.zh;
      this['가입일자'] = userGroupMember.getRegisteredTime;
    }
  }
}
