export default interface ContentsProviderRdo {
  searchFilter: string;
  registrantName?: string;
  startDate: number;
  endDate: number;
  limit: number;
  offset: number;

  areaType?: string;
  enabled?: string;
  creatorEmail?: string;
  contentsProviderId?: string;
  providerName?: string;
  creatorId?: string;
  createdTime?: number;
  modifierId?: string;
  modifiedTime?: number;
}
