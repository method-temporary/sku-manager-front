import { CardStates } from '../../../_data/lecture/cards/model/vo/CardStates';
import { SortFilterState } from 'shared/model';

interface CardSearchQdo {
  offset: number;
  limit: number;
  cardOrderBy: SortFilterState;

  searchPart: string;
  searchWord: string;

  collegeId: string;
  channelId: string;
  mainCategoryOnly: boolean;
  startDate: number;
  endDate: number;
  hasStamp?: boolean;
  cardState: CardStates | CardStates[];
  searchable?: boolean;
  cardType: string;

  sharedOnly: boolean;

  userGroupSequences: number;
}
