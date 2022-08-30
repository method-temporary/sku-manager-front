import { MemberModel } from '_data/approval/members/model';

import UserWorkspaceModel from '../../model/UserWorkspaceModel';
import { NonGdiMemberSdo } from '../../model/dto/NonGdiMemberSdo';
import { NonGdiMemberCitizenCdo } from '../../model/dto/NonGdiMemberCitizenCdo';
import { NonGdiMemberCitizenUdo } from '../../model/dto/NonGdiMemberCitizenUdo';
import { getPolyglotToAnyString, Language } from '../../../shared/components/Polyglot';
import { UserWorkspaceMemberXlsxModel } from '../../model/UserWorkspaceMemberXlsxModel';

export const getNonGdiMemberCitizenCdo = (
  userWorkspace: UserWorkspaceModel,
  member: MemberModel
): NonGdiMemberCitizenCdo => {
  //
  const nonGdiMemberSdo = new NonGdiMemberSdo();
  nonGdiMemberSdo.name = member.name;
  nonGdiMemberSdo.email = member.email.trim();
  nonGdiMemberSdo.usid = member.employeeId;
  nonGdiMemberSdo.phone = member.phone.trim();
  nonGdiMemberSdo.departmentName = getPolyglotToAnyString(member.departmentName);

  return {
    workspaceCineroomId: userWorkspace.id,
    companyCode: userWorkspace.usid,
    companyName: getPolyglotToAnyString(userWorkspace.name),
    nonGdiMemberSdo,
  };
};

export const getNonGdiMemberCitizenUdo = (
  userWorkspace: UserWorkspaceModel,
  member: MemberModel
): NonGdiMemberCitizenUdo => {
  //
  const nonGdiMemberSdo = new NonGdiMemberSdo();
  nonGdiMemberSdo.name = member.name;
  nonGdiMemberSdo.email = member.email.trim();
  nonGdiMemberSdo.usid = member.employeeId;
  nonGdiMemberSdo.phone = member.phone;
  nonGdiMemberSdo.departmentName = getPolyglotToAnyString(member.departmentName);

  return {
    workspaceCineroomId: userWorkspace.id,
    companyCode: userWorkspace.usid,
    companyName: getPolyglotToAnyString(userWorkspace.name),
    citizenId: member.id,
    nonGdiMemberSdo,
  };
};

export const getUserWorkspaceMemberXlsxModel = (index: number, member: MemberModel): UserWorkspaceMemberXlsxModel => {
  //
  return {
    사번: member.employeeId,
    '성명 (Ko)': member.name.getValue(Language.Ko),
    '성명 (En)': member.name.getValue(Language.En),
    '성명 (Zh)': member.name.getValue(Language.Zh),
    이메일: member.email,
    연락처: member.phone,
    소속부서명: member.departmentName.getValue(Language.Ko),
    사용자ID: member.id,
    작업구분: '',
  };
};
