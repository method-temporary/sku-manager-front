import { SortFilterState } from 'shared/model';
import { StudentEnrollmentType } from './vo/StudentEnrollmentType';

export default interface CardRdo {
  //
  offset: number;
  limit: number;
  cardOrderBy?: SortFilterState;

  name: string;
  collegeId: string;
  channelId: string;
  mainCategoryOnly?: boolean;
  registrantName: string;
  startDate: number;
  endDate: number;
  hasStamp?: boolean;
  cardState?: string | string[];
  studentEnrollmentType?: StudentEnrollmentType;
  searchable?: boolean;
  cardType?: string;

  sharedOnly?: boolean;

  userGroupSequences?: number[];
}

export function getEmptyCardRdo(): CardRdo {
  //
  return {
    offset: 0,
    limit: 20,
    cardOrderBy: SortFilterState.TimeDesc,
    name: '',
    collegeId: '',
    channelId: '',
    mainCategoryOnly: false,
    registrantName: '',
    startDate: 0,
    endDate: 0,
    hasStamp: undefined,
    cardState: '',
    searchable: undefined,
    cardType: '',
    studentEnrollmentType: '',
    sharedOnly: false,
    userGroupSequences: [],
  };
}
