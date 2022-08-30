import moment from 'moment';

export interface SearchBox {
  startDate?: number;
  endDate?: number;
  offset?: number;
  limit?: number;

  conceptId?: string;
  conceptName?: string;
  termName?: string;
  registrantName?: string;
  modifierName?: string;
}

export function getEmptySearchBox(): SearchBox {
  return {
    startDate: moment().startOf('day').subtract(1, 'y').toDate().getTime(),
    endDate: moment().endOf('day').toDate().getTime(),
    limit: 20,
    offset: 0,
  };
}
