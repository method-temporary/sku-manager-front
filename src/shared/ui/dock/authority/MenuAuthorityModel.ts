export default interface MenuAuthorityModel {
  isSuperManager?: boolean;
  isCompanyManager?: boolean;
  isCollegeManager?: boolean;

  etcAuth?: { authName: string; value: boolean }[];
}
