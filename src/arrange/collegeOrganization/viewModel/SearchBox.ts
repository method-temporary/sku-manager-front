export interface SearchBox {
  offset?: number;
  limit?: number;
  college?: string;
  orderBy?: string;
  collegeIds?: string;
}

export function getEmptySearchBox(): SearchBox {
  return {
    college: 'CLG00001',
    offset: 0,
    limit: 20,
    orderBy: 'STUDENTCOUNT',
  };
}
