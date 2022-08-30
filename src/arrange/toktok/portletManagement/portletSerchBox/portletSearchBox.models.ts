export interface PortletSearchBox {
  startDate: Date;
  endDate: Date;
  selectedDate: string;
  cineroom: string;
  keywordType: string;
  keyword: string;
}

export function initPortletSearchBox(): PortletSearchBox {
  const currentDate = new Date();
  return {
    startDate: new Date(2019, 11, 1),
    endDate: new Date(),
    selectedDate: 'all',
    cineroom: '',
    keywordType: '',
    keyword: '',
  };
}
