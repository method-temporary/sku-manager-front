import moment from 'moment';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeWithStudentCountRomModel } from '_data/badge/badges/model';

import { getBadgeStateDisplay } from '../../badge/ui/logic/BadgeHelper';

class BadgeApprovalExcelModel {
  //
  'NO': string = '';
  'Badge명(Ko)': string = '';
  'Badge명(En)': string = '';
  'Badge명(Zh)': string = '';
  '사용처': string = '';
  '분야': string = '';
  '유형': string = '';
  '레벨': string = '';
  '생성자': string = '';
  '생성일자': string = '';
  'Badge 상태': string = '';

  constructor(badgeWithStudent?: BadgeWithStudentCountRomModel, no?: number, cineroom?: string, category?: string) {
    //
    if (badgeWithStudent) {
      Object.assign(this, {
        NO: no,
        'Badge명(Ko)': badgeWithStudent.name?.ko || '-',
        'Badge명(En)': badgeWithStudent.name?.en || '-',
        'Badge명(Zh)': badgeWithStudent.name?.zh || '-',
        사용처: cineroom,
        분야: category,
        유형: badgeWithStudent.type,
        레벨: badgeWithStudent.level,
        생성자: getPolyglotToAnyString(
          badgeWithStudent.registrantName,
          getDefaultLanguage(badgeWithStudent.langSupports)
        ),
        생성일자: moment(badgeWithStudent.registeredTime).format('YYYY.MM.DD'),
        'Badge 상태': getBadgeStateDisplay(badgeWithStudent.state),
      });
    }
  }
}

export default BadgeApprovalExcelModel;
