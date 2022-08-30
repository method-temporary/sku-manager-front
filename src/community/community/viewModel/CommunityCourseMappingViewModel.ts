import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardWithContents } from '../../../card';
import { divisionCategories } from '../../../card/card/ui/logic/CardHelper';
import { CollegeService } from '../../../college';

export interface CommunityCourseMappingViewModel {
  id: string;
  name: string;
  channel: string;
  time: string;
  creator: string;
}

export function parseCommunityCourse(cardWiths: CardWithContents): CommunityCourseMappingViewModel {
  //
  const collegeService = CollegeService.instance;
  const { collegesMap, channelMap } = collegeService;
  const { card, cardContents } = cardWiths;
  const { mainCategory } = divisionCategories(card.categories);

  return {
    id: card.id,
    name: getPolyglotToAnyString(card.name),
    channel: `${collegesMap.get(mainCategory.collegeId)}>${channelMap.get(mainCategory.channelId)}`,
    time: moment(cardContents.registeredTime).format('YYYY. MM. DD'),
    creator: getPolyglotToAnyString(cardContents.registrantName),
  };
}
