import { PageModel } from 'shared/model';
import { yesNoToBoolean } from 'shared/helper/valueConvertHelper';

import BadgeRdo from '_data/badge/badges/model/BadgeRdo';
import { BadgeQueryModel } from '../../model/BadgeQueryModel';

export const fromBadgeRdo = (badgeQuery: BadgeQueryModel, pageModel: PageModel): BadgeRdo => {
  //
  return {
    startDate: badgeQuery.period.startDateLong,
    endDate: badgeQuery.period.endDateLong,
    cineroomId: badgeQuery.cineroomId,
    categoryId: badgeQuery.categoryId,
    type: badgeQuery.type,
    level: badgeQuery.level,
    issueAutomatically: badgeQuery.issueAutomatically ? yesNoToBoolean(badgeQuery.issueAutomatically) : undefined,
    additionalRequirementsNeeded: badgeQuery.additionalRequirementsNeeded
      ? yesNoToBoolean(badgeQuery.additionalRequirementsNeeded)
      : undefined,
    name: badgeQuery.searchPart === 'Badge명' ? badgeQuery.searchWord : '',
    registrantName: badgeQuery.searchPart === '생성자' ? badgeQuery.searchWord : '',
    state: badgeQuery.state,
    searchable: badgeQuery.searchable,
    groupSequences: badgeQuery.groupSequences,
    displayCategory: badgeQuery.displayCategory,
    limit: pageModel ? pageModel.limit : badgeQuery.offset,
    offset: pageModel ? pageModel.offset : badgeQuery.limit,
  };
};
