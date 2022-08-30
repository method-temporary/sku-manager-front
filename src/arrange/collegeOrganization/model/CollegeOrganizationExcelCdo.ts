import CollegeOrganizationCdo from './CollegeOrganizationCdo';

export default interface CollegeOrganizationExcelCdo {
  collegeId: string;
  cardCollegeOrderCdos?: CollegeOrganizationCdo[];
}

export function getCollegeOrganizationExcelCdo(
  collegeId: string,
  collegeOrganizationCdos: CollegeOrganizationCdo[]
): CollegeOrganizationExcelCdo {
  const collegeOrganizationCdoList: CollegeOrganizationCdo[] = [];

  collegeOrganizationCdos &&
    collegeOrganizationCdos.forEach((collegeOrganization) => {
      collegeOrganizationCdoList.push({ ...collegeOrganization, collegeId });
    });

  return {
    collegeId,
    cardCollegeOrderCdos: collegeOrganizationCdoList,
  };
}
