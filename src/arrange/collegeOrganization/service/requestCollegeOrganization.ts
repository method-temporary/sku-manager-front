import { findAllCollegeOrganization, findAllCollegeOrganizationExcel } from '../api/collegeOrganizationApi';
import { getSearchBox } from '../store/SearchBoxStore';
import { setCollegeOrganizationList } from '../store/CollegeOrganizationListStore';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import CollegeOrganization, { getCollegeOrganizationsWithCard } from '../model/CollegeOrganization';
import { getEmptySearchBox } from '../viewModel/SearchBox';

export function requestFindAllCollegeOrganization() {
  findAllCollegeOrganization(getSearchBox() || getEmptySearchBox()).then((collegeOrganization) => {
    //
    const offsetElementList = getEmptyNaOffsetElementList<CollegeOrganization>();

    const cardWithContents = collegeOrganization.results;

    const results: CollegeOrganization[] = getCollegeOrganizationsWithCard(cardWithContents);

    offsetElementList.results = results;
    offsetElementList.empty = collegeOrganization.empty;
    offsetElementList.totalCount = collegeOrganization.totalCount;
    offsetElementList.title = collegeOrganization.title;
    offsetElementList.offset = collegeOrganization.offset;
    offsetElementList.limit = collegeOrganization.limit;

    setCollegeOrganizationList(offsetElementList);

    // setCollegeOrganizationList(collegeOrganization);
  });
}

export function requestFindAllCollegeOrganizationExcel(): Promise<NaOffsetElementList<CollegeOrganization>> {
  //
  return findAllCollegeOrganizationExcel(getSearchBox() || getEmptySearchBox()).then((collegeOrganization) => {
    const offsetElementList = getEmptyNaOffsetElementList<CollegeOrganization>();

    const cardWithContents = collegeOrganization.results;

    const results: CollegeOrganization[] = getCollegeOrganizationsWithCard(cardWithContents);

    offsetElementList.results = results;
    offsetElementList.empty = collegeOrganization.empty;
    offsetElementList.totalCount = collegeOrganization.totalCount;
    offsetElementList.title = collegeOrganization.title;
    offsetElementList.offset = collegeOrganization.offset;
    offsetElementList.limit = collegeOrganization.limit;

    return offsetElementList;
  });
}
