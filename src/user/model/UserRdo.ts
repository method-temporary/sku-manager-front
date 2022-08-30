export interface UserRdo {
  offset: number;
  limit: number;
  endDate?: number;
  startDate?: number;
  name: string;
  signed?: boolean;
  companyCode?: string;
  department?: string;
  email: string;
  groupSequences?: string;
  checked?: boolean;
  excludeInvitation?: boolean;
}
