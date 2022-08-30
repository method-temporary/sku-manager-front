import moment from 'moment';

import { booleanToYesNo } from 'shared/helper';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { getBadgeStateDisplay } from '../ui/logic/BadgeHelper';
import BadgeWithStudentCountRomModel from '../../../../_data/badge/badges/model/BadgeWithStudentCountRomModel';

class BadgeExcelModel {
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
  '발급구분': string = '';
  'Badge 상태': string = '';
  '추가발급 요건': string = '';
  'Badge 획득인원': string = '';
  '도전중 인원': string = '';
  '도전 취소 인원': string = '';
  '발급 요청 인원': string = '';
  '발급 취소 인원': string = '';

  constructor(badgeWithStudent?: BadgeWithStudentCountRomModel, no?: number, cineroom?: string, category?: string) {
    //
    if (badgeWithStudent) {
      Object.assign(this, {
        NO: no,
        'Badge명(Ko)': badgeWithStudent.name.ko,
        'Badge명(En)': badgeWithStudent.name.en,
        'Badge명(Zh)': badgeWithStudent.name.zh,
        사용처: cineroom,
        분야: category,
        유형: badgeWithStudent.type,
        레벨: badgeWithStudent.level,
        생성자: getPolyglotToAnyString(
          badgeWithStudent.registrantName,
          getDefaultLanguage(badgeWithStudent.langSupports)
        ),
        생성일자: moment(badgeWithStudent.registeredTime).format('YYYY.MM.DD'),
        발급구분: badgeWithStudent.issueAutomatically ? 'Automatic' : 'Manual',
        'Badge 상태': getBadgeStateDisplay(badgeWithStudent.state),
        '추가발급 요건': booleanToYesNo(badgeWithStudent.additionalRequirementsNeeded),
        'Badge 획득인원': badgeWithStudent.issuedCount,
        '도전중 인원': badgeWithStudent.challengingCount,
        '도전 취소 인원': badgeWithStudent.cancelChallengeCount,
        '발급 요청 인원': badgeWithStudent.requestingCount,
        '발급 취소 인원': badgeWithStudent.cancelCount,
      });
    }
  }
}

export default BadgeExcelModel;
