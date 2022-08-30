import { UserWithPisAgreement } from './UserWithPisAgreement';

export class UserExcelModel {
  //
  '사번': string = '';
  '성명(Ko)': string = '';
  '성명(En)': string = '';
  '성명(Zh)': string = '';
  '성별(Male/Female)': string = '';
  '생년월일(YYYY-MM-DD)': string = '';
  'E-mail': string = '';
  '소속회사(Ko)': string = '';
  '소속회사(En)': string = '';
  '소속회사(Zh)': string = '';
  '소속부서명(Ko)': string = '';
  '소속부서명(En)': string = '';
  '소속부서명(Zh)': string = '';
  '동의일자': string = '';
  '등록일자': string = '';
  '사용자 그룹': string = '';

  constructor(userWithPisAgreement?: UserWithPisAgreement) {
    //
    if (userWithPisAgreement) {
      const { user, pisAgreement } = userWithPisAgreement;

      Object.assign(this, {
        사번: user.employeeId,
        '성명(Ko)': user.name.ko,
        '성명(En)': user.name.en,
        '성명(Zh)': user.name.zh,
        '성별(Male/Female)': user.gender || '',
        '생년월일(YYYY-MM-DD)': user.birthDate,
        'E-mail': user.email,
        '소속회사(Ko)': user.companyName.ko,
        '소속회사(En)': user.companyName.en,
        '소속회사(Zh)': user.companyName.zh,
        '소속부서명(Ko)': user.departmentName.ko,
        '소속부서명(En)': user.departmentName.en,
        '소속부서명(Zh)': user.departmentName.zh,
        동의일자: pisAgreement.signedDate === 0 ? 'Disagree' : pisAgreement.getSignedDate,
        등록일자: user.getCreationTime,
        '사용자 그룹': '',
      });
    }
  }
}
