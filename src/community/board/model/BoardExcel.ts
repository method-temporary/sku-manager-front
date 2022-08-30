export default interface CommunityExcel {
  id?: string;
  type?: string;
  fieldId?: string;
  thumbnail?: string;
  name?: string;
  title?: string;
  description?: string;
  isOpend?: string;
  creator?: string;
  time?: number;
  Member?: string;
}

export function getEmptyCommunityExcel(): CommunityExcel {
  return {};
}
