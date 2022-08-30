import { IdName } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import Category, { getCategory } from './Category';
import { CardWithContents } from '../../../card';
import { CollegeService } from '../../../college';
import { divisionCategories } from '../../../card/card/ui/logic/CardHelper';
import { getSearchBox } from '../store/SearchBoxStore';

export default interface CollegeOrganization {
  id?: string;
  college: string;
  channel?: string;
  name?: string;
  type?: string;
  collegeOrder: number;
  category: Category;
  cubeType?: string;
  errorDetail?: string;
  orderResult?: string;
  cardId?: string;
}

export interface CollegeOrganizationExcel {
  categoryName: string;
  channelName?: string;
  cardName?: string;
  serviceType?: string;
  categoryOrder: number;
  serviceId?: string;
}

export interface CollegeOrder {
  id: string;
  collegeId: string;
  withNewCards: boolean;
  registrant: string;
  registeredTime: number;
  modifier: string;
  modifiedTime: number;
}

export function convertToExcel(collegeOrganization: CollegeOrganization[]): CollegeOrganizationExcel[] {
  return collegeOrganization.map(({ cardId, category, name, type /*, collegeOrder*/ }, index) => {
    return {
      cardId,
      categoryName: category.college.name,
      channelName: category.channel.name,
      cardName: name,
      serviceType: type || 'Card',
      categoryOrder: index + 1,
      // collegeOrder: collegeOrder !== 2147483647 ? collegeOrder : 0,
    };
  });
}

export function getCollegeOrganizationsWithCard(cardWithContents: CardWithContents[]): CollegeOrganization[] {
  //
  const collegeService = CollegeService.instance;
  const { collegesMap, channelMap } = collegeService;
  const results: CollegeOrganization[] = [];

  const searchBox = getSearchBox();

  cardWithContents &&
    cardWithContents.length > 0 &&
    cardWithContents.forEach((cardWiths, index) => {
      const { card } = cardWiths;
      const { mainCategory } = divisionCategories(card.categories);
      const collegeIdName = new IdName({
        id: mainCategory.collegeId,
        name: collegesMap.get(mainCategory.collegeId),
      } as IdName);
      const channelIdName = new IdName({
        id: mainCategory.channelId,
        name: channelMap.get(mainCategory.channelId),
      } as IdName);

      results.push({
        id: card.id,
        college: mainCategory.collegeId,
        channel: mainCategory.channelId,
        name: getPolyglotToAnyString(card.name),
        type: card.type || 'Card',
        collegeOrder: (searchBox?.offset || 0) + index + 1,
        category: getCategory(collegeIdName, channelIdName),
        // cubeType:
        // errorDetail:
        // orderResult:
        cardId: card.id,
      });
    });

  return results;
}
