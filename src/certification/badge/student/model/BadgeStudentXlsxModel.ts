export class BadgeStudentXlsxModel {
  //
  '소속사(Ko)': string = '';
  '소속사(En)': string = '';
  '소속사(Zh)': string = '';
  '소속 조직(팀) (Ko)': string = '';
  '소속 조직(팀) (En)': string = '';
  '소속 조직(팀) (Zh)': string = '';
  '성명(Ko)': string = '';
  '성명(En)': string = '';
  '성명(Zh)': string = '';
  'E-mail': string = '';
  신청일자: string = '';
  진도율: string = '';
  '추가미션 메일발송': string = '';
  추가미션수행: string = '';
  발급일자: string = '';
  'Badge 획득여부': string = '';
  재직여부: string = '';

  constructor(badgeXlsx: BadgeStudentXlsxModel) {
    //
    if (badgeXlsx) {
      Object.assign(this, badgeXlsx);
    }
  }
}
