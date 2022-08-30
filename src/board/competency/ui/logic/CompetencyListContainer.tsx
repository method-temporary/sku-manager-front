import React, { useEffect } from 'react';
import { Breadcrumb, Container, Header } from 'semantic-ui-react';
import CompetencyListViewContainer from './CompetencyListViewContainer';
import SearchBoxContainer from './SearchBoxContainer';
import { setSearchBox, useSearchBox } from 'board/competency/store/SearchBoxStore';
import { getEmptySearchBox } from 'board/competency/model/SearchBox';
import { requestFindAllCompetency } from 'board/competency/service/requestCompetency';

const BREADCRUMB_PATH = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Tag', content: '역량 관리', active: true },
];
const CompetencyListContainer: React.FC = function CompetencyListContainer() {
  useEffect(() => {
    setSearchBox(getEmptySearchBox());
    requestFindAllCompetency();
  }, []);
  const searchBox = useSearchBox();

  return (
    <Container>
      <div>
        <Breadcrumb icon="right angle" sections={BREADCRUMB_PATH} />
        <Header as="h2">역량 관리</Header>
      </div>
      {searchBox !== undefined && <SearchBoxContainer searchBox={searchBox} />}
      <CompetencyListViewContainer />
    </Container>
  );
};

export default CompetencyListContainer;
