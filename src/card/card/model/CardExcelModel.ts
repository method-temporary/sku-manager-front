import moment from 'moment';

import { UserGroupRuleModel } from 'shared/model';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { getBasedAccessRuleViewString } from 'shared/helper';

import { CardWithContents } from '../index';
import { CardStates } from '../../../_data/lecture/cards/model/vo/CardStates';
import { cardStateDisplay, displayChannel } from '../ui/logic/CardHelper';
import { CollegeService } from '../../../college';

export class CardExcelModel {
  //
  '카드명(Ko)': string = '';
  '카드명(En)': string = '';
  '카드명(Zh)': string = '';
  카드유형: string = '';
  Channel: string = '';
  선수카드: string = '';
  Stamp: string = '';
  등록일자: string = '';
  승인일자: string = '';
  제공상태: string = '';
  생성자: string = '';
  학습자: number = 0;
  이수자: number = 0;
  공개여부: string = '';
  '접근제어 기본 정책': string = '';
  접근제어규칙: string = '';

  constructor(
    cardWiths?: CardWithContents,
    collegeService?: CollegeService,
    userGroupMap?: Map<number, UserGroupRuleModel>
  ) {
    //
    if (cardWiths && collegeService && userGroupMap) {
      const { card, cardContents, cardRelatedCount } = cardWiths;

      const { policy, result } =
        card && card.groupBasedAccessRule && getBasedAccessRuleViewString(card.groupBasedAccessRule, userGroupMap);

      Object.assign(this, {
        '카드명(Ko)': card.name.ko,
        '카드명(En)': card.name.en,
        '카드명(Zh)': card.name.zh,
        카드유형: card.type,
        Channel: displayChannel(card.categories),
        선수카드: cardContents.prerequisiteCards.length > 0 ? 'Yes' : 'No',
        Stamp: card.stampCount > 0 ? 'Yes' : 'No',
        등록일자: moment(cardContents.registeredTime).format('YYYY.MM.DD HH:mm:ss'),
        승인일자:
          card.cardState === CardStates.Opened ? moment(card.cardStateModifiedTime).format('YYYY.MM.DD HH:mm:ss') : '-',
        제공상태: cardStateDisplay(card.cardState),
        생성자: getPolyglotToAnyString(cardContents.registrantName, getDefaultLanguage(card.langSupports)),
        학습자: cardRelatedCount.studentCount,
        이수자: cardRelatedCount.passedStudentCount,
        공개여부: card.searchable ? 'Yes' : 'No',
        '접근제어 기본 정책': policy,
        접근제어규칙: result,
      });
    }
  }
}
