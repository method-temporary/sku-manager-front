import { GroupBasedAccessRule, PatronKey, PolyglotModel } from 'shared/model';
import { LangSupport, langSupportCdo } from 'shared/components/Polyglot';

import { BadgeModel } from './BadgeModel';
import { BadgeOpenRequestModel, CategoryModel } from './vo';
import { DenizenKey } from '@nara.platform/accent';
import { yesNoToBoolean } from 'shared/helper';

class BadgeCdo {
  //
  name: PolyglotModel = new PolyglotModel();
  forSelectedMember: boolean | undefined = true; // HR 선발형
  type: string = ''; // 유형
  categories: CategoryModel[] = []; // Main 분야 Id
  level: string = ''; // Level
  issueAutomatically: boolean | undefined = true; // 발급 구분
  additionalRequirementsNeeded: boolean | undefined = false; // 추가 발급 조건
  iconUrl: string = ''; // Icon
  searchable: boolean = true;

  // 추가 정보
  qualification: PolyglotModel = new PolyglotModel();
  acquisitionRequirements: PolyglotModel = new PolyglotModel(); // 획득 조건
  operator: DenizenKey = new PatronKey(); // 담당자
  description: PolyglotModel = new PolyglotModel(); // 상세설명
  tags: PolyglotModel = new PolyglotModel(); // Tag정보

  // 접근 제어 정보
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  // 학습 정보
  cardIds: string[] = [];
  relatedBadgeIds: string[] = [];
  learningTime: number = 0;

  // 기타 정보
  requestApproval: boolean = false; // 승인 요청
  collegeId: string = '';
  openRequest: BadgeOpenRequestModel = new BadgeOpenRequestModel();

  // 언어선택
  langSupports: LangSupport[] = [];

  static getBadgeCdo(badge: BadgeModel, isRequestApproval: boolean): BadgeCdo {
    return {
      name: badge.name,
      forSelectedMember: badge.forSelectedMember,
      type: badge.type,
      categories: badge.categories,
      level: badge.level,
      issueAutomatically: badge.issueAutomatically,
      additionalRequirementsNeeded: badge.additionalRequirementsNeeded,
      iconUrl: badge.iconUrl,
      searchable: badge.searchable,
      qualification: badge.qualification,
      acquisitionRequirements: badge.acquisitionRequirements,
      operator: badge.operator,
      description: badge.description,
      tags: badge.tags,
      cardIds: badge.cardIds,
      relatedBadgeIds: badge.relatedBadgeIds,
      requestApproval: isRequestApproval,
      groupBasedAccessRule: badge.groupBasedAccessRule,
      collegeId: badge.collegeId,
      openRequest: new BadgeOpenRequestModel(),
      learningTime: badge.learningTime,
      langSupports: langSupportCdo(badge.langSupports),
    };
  }
}

export default BadgeCdo;
