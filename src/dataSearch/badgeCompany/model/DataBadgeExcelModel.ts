import moment from 'moment';
import { DataBadgeModel } from './DataBadgeModel';

class DataBadgeExcelModel {
  //
  //badge_id        : string = '';
  'Badge명': string = '';
  회사: string = '';
  '소속부서명': string = '';
  회원명: string = '';
  email: string = '';
  도전상태: string = '';
  도전시간: string = '';
  '완료여부': string = '';
  이수시간: string = '';
  진행률: string = '';

  constructor(badgeStudent?: DataBadgeModel, no?: number) {
    //
    if (badgeStudent) {
      Object.assign(this, {
        //NO              : no,
        //badge_id        : badgeStudent.badge,
        Badge명: badgeStudent.badgeName,
        회사: badgeStudent.companyName,
        소속부서명: badgeStudent.departmentName,
        회원명: badgeStudent.name,
        email: badgeStudent.email,
        도전상태: badgeStudent.challengeState,
        도전시간: moment(badgeStudent.challengeTime).format('YYYY.MM.DD HH:mm:ss'),
        완료여부: badgeStudent.issueState,
        이수시간: badgeStudent.issueTime ? moment(badgeStudent.issueTime).format('YYYY.MM.DD HH:mm:ss') : '-',
        진행률: badgeStudent.issueCnt + ' / ' + badgeStudent.cardIds,
      });
    }
  }
}

export default DataBadgeExcelModel;
