import React, { useState } from 'react';
import CollegeOrganizationListView from '../view/CollegeOrganizationListView';
import { useCollegeOrganizationList } from 'arrange/collegeOrganization/store/CollegeOrganizationListStore';
import { useSearchBox } from 'arrange/collegeOrganization/store/SearchBoxStore';

const CollegeOrganizationListViewContainer: React.FC = function CollegeOrganizationListViewContainer() {
  const collegeOrganizationList = useCollegeOrganizationList();
  const searchBox = useSearchBox();

  return (
    <>
      {collegeOrganizationList !== undefined && searchBox !== undefined && (
        <CollegeOrganizationListView
          collegeOrganizationList={collegeOrganizationList}
          searchBox={searchBox}
        />
      )}
    </>
  );
};

export default CollegeOrganizationListViewContainer;
