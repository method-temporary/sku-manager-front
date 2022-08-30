import moment from 'moment';

export interface SearchBox {
  startDate?: number;
  endDate?: number;
  offset?: number;
  limit?: number;

  competencyGroup?: string;
  competencyName?: string;
  creatorName?: string;
  updaterName?: string;
}

export function getEmptySearchBox(): SearchBox {
  return {
    startDate: moment().startOf('day').subtract(1, 'y').toDate().getTime(),
    endDate: moment().endOf('day').toDate().getTime(),
    limit: 20,
    offset: 0,
  };
}
