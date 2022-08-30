import { decorate, observable } from 'mobx';

import { PolyglotModel } from 'shared/model';
import { LangSupport, DEFAULT_LANGUAGE } from 'shared/components/Polyglot';

import { BadgeModel } from './BadgeModel';

export default class BadgeWithStudentCountRomModel {
  //
  id: string = '';
  name: PolyglotModel = new PolyglotModel();
  categoryId: string = '';
  type: string = '';
  level: string = '';
  registrantName: PolyglotModel = new PolyglotModel();
  registeredTime: number = 0;
  openRequestedTime: number = 0;
  issueAutomatically: boolean | undefined = undefined;
  state: string = '';
  additionalRequirementsNeeded: boolean | undefined = undefined;
  issuedCount: number = 0;
  challengingCount: number = 0;
  cancelChallengeCount: number = 0;
  requestingCount: number = 0;
  cancelCount: number = 0;
  cineroomId: string = '';
  email: string = '';
  // operator:BadgeOperatorModel= new BadgeOperatorModel();
  operator: string = '';

  langSupports: LangSupport[] = [DEFAULT_LANGUAGE];

  constructor(badgeWithStudent?: BadgeWithStudentCountRomModel) {
    if (badgeWithStudent) {
      const name = (badgeWithStudent.name && new PolyglotModel(badgeWithStudent.name)) || new PolyglotModel();
      const registrantName =
        (badgeWithStudent.registrantName && new PolyglotModel(badgeWithStudent.registrantName)) || new PolyglotModel();

      Object.assign(this, { ...badgeWithStudent, name, registrantName });
    }
  }

  static asBadgeWithCountStudents(badge: BadgeModel): BadgeWithStudentCountRomModel {
    //
    const mainCategory = badge.categories.filter((category) => category.mainCategory);

    return {
      id: badge.id,
      name: badge.name,
      categoryId: mainCategory[0].categoryId,
      type: badge.type,
      level: badge.level,
      registrantName: badge.registrantName,
      registeredTime: badge.registeredTime,
      issueAutomatically: badge.issueAutomatically,
      state: badge.state,
      additionalRequirementsNeeded: badge.additionalRequirementsNeeded,
      cineroomId: badge.patronKey.keyString.slice(badge.patronKey.keyString.indexOf('@') + 1),
      issuedCount: 0,
      challengingCount: 0,
      cancelChallengeCount: 0,
      requestingCount: 0,
      cancelCount: 0,
      email: '',
      operator: badge.operator.keyString,
      openRequestedTime: badge.registeredTime,

      langSupports: badge.langSupports,
    };
  }
}
decorate(BadgeWithStudentCountRomModel, {
  id: observable,
  name: observable,
  categoryId: observable,
  type: observable,
  level: observable,
  registrantName: observable,
  registeredTime: observable,
  issueAutomatically: observable,
  state: observable,
  additionalRequirementsNeeded: observable,
  issuedCount: observable,
  challengingCount: observable,
  cancelChallengeCount: observable,
  requestingCount: observable,
  cancelCount: observable,
  cineroomId: observable,
  email: observable,
  operator: observable,

  langSupports: observable,
});
