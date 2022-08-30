import { CommunityMemberApprovedType } from 'community/member/model/Member';

export default interface GroupMemberRdo {
  searchFilter: string;
  name: string;
  startDate: number;
  endDate: number;
  limit: number;
  offset: number;

  communityId: string;
  groupId: string;
  approved: CommunityMemberApprovedType | null;

  companyName: string;
  teamName: string;
  nickName: string;
  email: string;
}
