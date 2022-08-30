export default interface CollegeOrganizationCdo {
  cardId?: string;
  cardName?: string;
  channelName?: string;
  collegeId: string;
  collegeName: string;
  collegeOrder?: string;
}

export function getEmptyCollegeOrganizationCdo(): CollegeOrganizationCdo {
  return {
    cardId: '',
    cardName: '',
    channelName: '',
    collegeId: '',
    collegeName: '',
    collegeOrder: '',
  };
}

export function getCollegeOrganizationCdos(collegeOrganization: any[]): CollegeOrganizationCdo[] {
  return collegeOrganization.map(({ cardId, cardName, channelName, collegeId, categoryName, categoryOrder }, index) => {
    return {
      cardId,
      cardName,
      collegeId,
      channelName,
      collegeName: categoryName,
      collegeOrder: categoryOrder,
    };
  });
}