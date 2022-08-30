import { computed, decorate, observable } from 'mobx';
import { QueryModel, GroupBasedAccessRule, PolyglotModel } from 'shared/model';

import { BadgeModel } from '_data/badge/badges/model/BadgeModel';
import { BadgeOpenRequestModel } from '_data/badge/badges/model/vo';

import { CardModel } from '../../../../card';
import { BadgeOperatorModel } from './BadgeOperatorModel';

export class BadgeQueryModel extends QueryModel {
  //
  id: string = '';
  fileName: string = '';
  cineroomId: string = '';
  openRequest: BadgeOpenRequestModel = new BadgeOpenRequestModel();

  name: string = '';
  forSelectedMember: string = ''; // HR 선발형
  type: string = ''; // 유형
  categoryId: string = ''; // Main 분야 Id
  subCategoryIds: string[] = []; // Sub 분야 Ids,
  level: string = ''; // Level
  issueAutomatically: string = ''; // 발급 구분
  additionalRequirementsNeeded: string = ''; // 추가 발급 조건
  iconUrl: string = ''; // Icon
  searchable: string = ''; // 공개 여부

  // 추가 정보
  qualification: PolyglotModel = new PolyglotModel(); // 자격증명
  acquisitionRequirements: PolyglotModel = new PolyglotModel(); // 획득 조건
  operator: BadgeOperatorModel = new BadgeOperatorModel(); // 담당자
  description: PolyglotModel = new PolyglotModel(); // 상세설명
  tags: PolyglotModel = new PolyglotModel(); // Tag정보

  // 학습 정보
  cardIds: string[] = [];
  cards: CardModel[] = [];
  relatedBadgeIds: string[] = [];
  relatedBadges: BadgeModel[] = [];
  challengingCount: number = 0;
  issuedCount: number = 0;
  displayCategory: boolean = false;

  // 기타 정보
  requestApproval: boolean = false; // 승인 요청

  // 자동 생성 정보time
  state: string = ''; // 상태
  displayState: string = '';
  registrantName: string = ''; // 생성자 이름
  creatorEmail: string = ''; // 생성자 Email
  time: number = 0; // 생성 일자

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  groupSequences: number[] = [];
  ruleStrings: string = '';

  constructor(badgeQuery?: BadgeQueryModel) {
    //
    super();

    if (badgeQuery) {
      Object.assign(this, {
        ...badgeQuery,
      });
    }
  }

  @computed
  get sequences() {
    //
    let sequences = '';
    this.groupSequences?.forEach((seq, index) => {
      index === 0 ? (sequences = seq + '') : (sequences += ',' + seq);
    });

    return sequences;
  }
}

decorate(BadgeQueryModel, {
  id: observable,
  fileName: observable,
  cineroomId: observable,
  name: observable,
  forSelectedMember: observable,
  type: observable,
  categoryId: observable,
  subCategoryIds: observable,
  level: observable,
  issueAutomatically: observable,
  additionalRequirementsNeeded: observable,
  iconUrl: observable,
  searchable: observable,
  qualification: observable,
  acquisitionRequirements: observable,
  description: observable,
  tags: observable,
  cardIds: observable,
  cards: observable,
  relatedBadgeIds: observable,
  relatedBadges: observable,
  requestApproval: observable,
  state: observable,
  displayState: observable,
  registrantName: observable,
  creatorEmail: observable,
  time: observable,
  groupBasedAccessRule: observable,
  groupSequences: observable,
  ruleStrings: observable,
  displayCategory: observable,
});
