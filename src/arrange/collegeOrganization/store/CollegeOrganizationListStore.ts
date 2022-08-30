import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import { createStore } from './Store';
import CollegeOrganization from '../model/CollegeOrganization';

const collegeOrganizationListStore: NaOffsetElementList<CollegeOrganization> = getEmptyNaOffsetElementList();

const [setCollegeOrganizationList, onCollegeOrganizationList, getCollegeOrganizationList, useCollegeOrganizationList] =
  createStore(collegeOrganizationListStore);

export {
  setCollegeOrganizationList,
  onCollegeOrganizationList,
  getCollegeOrganizationList,
  useCollegeOrganizationList,
};
