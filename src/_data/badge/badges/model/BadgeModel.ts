import { decorate, observable } from 'mobx';

import { DenizenKey, DramaEntity } from '@nara.platform/accent';

import { PatronKey, GroupBasedAccessRule, PolyglotModel } from 'shared/model';
import { LangSupport, langSupportCdo, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

import { CardWithContents } from 'card';
import { BadgeOpenRequestModel, CategoryModel, BadgeState } from './vo';
import BadgeWithStudentCountRomModel from './BadgeWithStudentCountRomModel';

export class BadgeModel implements DramaEntity {
  //
  entityVersion: number = 0;
  patronKey: PatronKey = new PatronKey();
  id: string = '';

  fileName: string = '';
  cineroomId: string = '';
  openRequest: BadgeOpenRequestModel = new BadgeOpenRequestModel();

  name: PolyglotModel = new PolyglotModel(); //;
  forSelectedMember: boolean | undefined = undefined; // HR 선발형
  type: string = ''; // 유형
  categories: CategoryModel[] = []; //
  level: string = ''; // Level
  issueAutomatically: boolean | undefined = undefined; // 발급 구분
  additionalRequirementsNeeded: boolean | undefined = undefined; // 추가 발급 조건
  iconUrl: string = ''; // Icon
  collegeId: string = '';
  email: string = '';
  searchable: boolean = true;

  // 추가 정보
  qualification: PolyglotModel = new PolyglotModel(); // 자격증명
  acquisitionRequirements: PolyglotModel = new PolyglotModel(); // 획득 조건
  operator: DenizenKey = new PatronKey();
  description: PolyglotModel = new PolyglotModel(); // 상세설명
  tags: PolyglotModel = new PolyglotModel(); // Tag정보

  // 학습 정보
  cardIds: string[] = [];
  cards: CardWithContents[] = [];
  relatedBadgeIds: string[] = [];
  relatedBadges: BadgeWithStudentCountRomModel[] = [];
  learningTime: number = 0;

  // 접근 제어
  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  // 기타 정보
  state: string = ''; // 상태;
  displayState: string = ''; // Display 상태
  registrantName: PolyglotModel = new PolyglotModel(); // 생성자 이름
  creatorEmail: string = ''; // 생성자 Email
  registeredTime: number = 0; // 생성 일자

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(badge?: BadgeModel) {
    //
    if (badge) {
      //
      // const operator = badge.operator && new BadgeOperatorModel(badge.operator) || this.operator;
      const groupBasedAccessRule =
        (badge.groupBasedAccessRule && new GroupBasedAccessRule(badge.groupBasedAccessRule)) ||
        this.groupBasedAccessRule;
      const openRequest = (badge.openRequest && new BadgeOpenRequestModel(badge.openRequest)) || this.openRequest;

      const name = (badge.name && new PolyglotModel(badge.name)) || new PolyglotModel();
      const qualification = (badge.qualification && new PolyglotModel(badge.qualification)) || new PolyglotModel();
      const acquisitionRequirements =
        (badge.acquisitionRequirements && new PolyglotModel(badge.acquisitionRequirements)) || new PolyglotModel();
      const description = (badge.description && new PolyglotModel(badge.description)) || new PolyglotModel();
      const tags = (badge.tags && new PolyglotModel(badge.tags)) || new PolyglotModel();
      const registrantName = (badge.registrantName && new PolyglotModel(badge.registrantName)) || new PolyglotModel();

      const langSupports =
        badge.langSupports &&
        badge.langSupports.map((langSupport) => new LangSupport(langSupport) || new LangSupport());

      Object.assign(this, {
        ...badge,
        openRequest,
        groupBasedAccessRule,
        name,
        qualification,
        acquisitionRequirements,
        description,
        tags,
        registrantName,
        langSupports,
      });
    }
  }

  static asModifiedNameValues(badge: BadgeModel) {
    //
    const asNameValues = {
      nameValues: [
        {
          name: 'name',
          value: JSON.stringify(badge.name),
        },
        {
          name: 'forSelectedMember',
          value: JSON.stringify(badge.forSelectedMember),
        },
        {
          name: 'type',
          value: badge.type,
        },
        {
          name: 'categories',
          value: JSON.stringify(badge.categories),
        },
        {
          name: 'level',
          value: badge.level,
        },
        {
          name: 'issueAutomatically',
          value: JSON.stringify(badge.issueAutomatically),
        },
        {
          name: 'searchable',
          value: String(badge.searchable),
        },
        {
          name: 'additionalRequirementsNeeded',
          value: JSON.stringify(badge.additionalRequirementsNeeded),
        },
        {
          name: 'iconUrl',
          value: badge.iconUrl,
        },
        {
          name: 'qualification',
          value: JSON.stringify(badge.qualification),
        },
        {
          name: 'acquisitionRequirements',
          value: JSON.stringify(badge.acquisitionRequirements),
        },
        {
          name: 'operator',
          value: badge.operator.keyString,
        },
        {
          name: 'description',
          value: JSON.stringify(badge.description),
        },
        {
          name: 'tags',
          value: JSON.stringify(badge.tags),
        },
        {
          name: 'groupBasedAccessRule',
          value: JSON.stringify(badge.groupBasedAccessRule),
        },
        {
          name: 'cardIds',
          value: JSON.stringify(badge.cardIds),
        },
        {
          name: 'relatedBadgeIds',
          value: JSON.stringify(badge.relatedBadgeIds),
        },
        {
          name: 'collegeId',
          value: badge.collegeId,
        },
        {
          name: 'learningTime',
          value: JSON.stringify(badge.learningTime),
        },
        {
          name: 'langSupports',
          value: JSON.stringify(langSupportCdo(badge.langSupports)),
        },
      ],
    };

    return asNameValues;
  }

  static asApprovalNameValues(openRequestTime: number = 0) {
    //
    const openRequest = new BadgeOpenRequestModel();
    openRequest.time = openRequestTime;
    return {
      nameValues: [
        {
          name: 'openRequest',
          value: JSON.stringify(openRequest),
        },
        {
          name: 'state',
          value: BadgeState.OpenApproval,
        },
      ],
    };
  }
}

decorate(BadgeModel, {
  entityVersion: observable,
  patronKey: observable,
  id: observable,
  fileName: observable,
  cineroomId: observable,
  openRequest: observable,
  name: observable,
  forSelectedMember: observable,
  type: observable,
  categories: observable,
  level: observable,
  issueAutomatically: observable,
  additionalRequirementsNeeded: observable,
  iconUrl: observable,
  qualification: observable,
  acquisitionRequirements: observable,
  operator: observable,
  description: observable,
  tags: observable,
  cardIds: observable,
  cards: observable,
  relatedBadgeIds: observable,
  groupBasedAccessRule: observable,
  state: observable,
  displayState: observable,
  registrantName: observable,
  creatorEmail: observable,
  registeredTime: observable,
  collegeId: observable,
  email: observable,
  learningTime: observable,
  relatedBadges: observable,
  langSupports: observable,
  searchable: observable,
});
