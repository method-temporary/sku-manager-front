import React from 'react';
import { Breadcrumb, Container, Header } from 'semantic-ui-react';
import DashBoardSentenceListViewContainer from './DashBoardSentenceListViewContainer';
import SearchBox from './SearchBox';

const BREADCRUMB_PATH = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '전시 관리', link: true },
  { key: 'Dashboard', content: '대시보드 관리', link: true },
  { key: 'Tag', content: '대시보드 문구 관리', active: true },
];
const SearchTagListContainer: React.FC = function SearchTagListContainer() {
  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={BREADCRUMB_PATH} />
        <Header as="h2">대시보드 관리</Header>
      </div>
      <SearchBox />
      <DashBoardSentenceListViewContainer />
    </Container>
  );
};

export default SearchTagListContainer;
