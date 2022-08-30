import React, { useEffect } from 'react';
import { Breadcrumb, Container, Header } from 'semantic-ui-react';
import { requestFindAllCapability } from 'board/capability/service/requestCapability';
import CollegeOrganizationListViewContainer from './CollegeOrganizationListViewContainer';
import { getEmptySearchBox } from 'arrange/collegeOrganization/viewModel/SearchBox';
import { setSearchBox } from 'arrange/collegeOrganization/store/SearchBoxStore';

const BREADCRUMB_PATH = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Main', content: '전시관리', link: true },
  { key: 'MainCategory', content: 'Main 카테고리 관리', link: true },
  { key: 'Tag', content: '학습카드 순서관리', active: true },
];
const CollegeOrganizationListContainer: React.FC = function CollegeOrganizationListContainer() {
  useEffect(() => {
    setSearchBox(getEmptySearchBox());
    // requestFindAllCapability();
    //TODO : searchBox or 별도 값 처리(college)
    // const searchBox = useSearchBox();
  }, []);

  return (
    <Container>
      <div>
        <Breadcrumb icon="right angle" sections={BREADCRUMB_PATH} />
        <Header as="h2">학습카드 순서관리</Header>
      </div>
      <CollegeOrganizationListViewContainer />
    </Container>
  );
};

export default CollegeOrganizationListContainer;
