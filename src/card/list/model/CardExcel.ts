import dayjs from 'dayjs';

import { UserGroupRuleModel } from 'shared/model';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardRelatedCount, CardStates } from '_data/lecture/cards/model/vo';
import CardContents, { getInitCardContents } from '_data/lecture/cards/model/CardContents';
import Card, { getInitCard } from '_data/lecture/cards/model/Card';

import { cardStateDisplay, displayChannel } from '../../card/ui/logic/CardHelper';
import { getBasedAccessRuleViewString } from '../../../shared/helper';
import { getInitCardRelatedCount } from '../../../_data/lecture/cards/model/vo';

export interface CardExcel {
  //
  '카드명(Ko)': string;
  '카드명(En)': string;
  '카드명(Zh)': string;
  과정유형: string;
  카드유형: string;
  Channel: string;
  선수카드: string;
  Stamp: string;
  등록일자: string;
  승인일자: string;
  제공상태: string;
  생성자: string;
  학습자: number;
  이수자: number;
  공개여부: string;
  '접근제어 기본 정책': string;
  접근제어규칙: string;
}

export function getCardExcelByCardWiths(
  card: Card,
  cardContents: CardContents,
  cardRelatedCount: CardRelatedCount,
  userGroupMap: Map<number, UserGroupRuleModel>
): CardExcel {
  //
  if (!card) card = getInitCard();
  if (!cardContents) cardContents = getInitCardContents();
  if (!cardRelatedCount) cardRelatedCount = getInitCardRelatedCount();

  const { policy, result } =
    card && card.groupBasedAccessRule && getBasedAccessRuleViewString(card.groupBasedAccessRule, userGroupMap);

  return {
    '카드명(Ko)': card.name.ko,
    '카드명(En)': card.name.en,
    '카드명(Zh)': card.name.zh,
    과정유형: card.studentEnrollmentType === 'Anyone' ? '상시형' : '수강신청형',
    카드유형: card.type,
    Channel: displayChannel(card.categories),
    선수카드: cardContents?.prerequisiteCards?.length > 0 ? 'Yes' : 'No',
    Stamp: card.stampCount > 0 ? 'Yes' : 'No',
    등록일자: dayjs(cardContents.registeredTime).format('YYYY.MM.DD HH:mm:ss'),
    승인일자:
      card.cardState === CardStates.Opened ? dayjs(card.cardStateModifiedTime).format('YYYY.MM.DD HH:mm:ss') : '-',
    제공상태: cardStateDisplay(card.cardState),
    생성자: getPolyglotToAnyString(cardContents.registrantName, getDefaultLanguage(card.langSupports)),
    학습자: cardRelatedCount.studentCount,
    이수자: cardRelatedCount.passedStudentCount,
    공개여부: card.searchable ? 'Yes' : 'No',
    '접근제어 기본 정책': policy,
    접근제어규칙: result,
  };
}
