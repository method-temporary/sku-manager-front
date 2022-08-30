import React, { useEffect } from 'react';
import { Breadcrumb, Container, Header } from 'semantic-ui-react';
import ConceptListViewContainer from './ConceptListViewContainer';
import SearchBoxContainer from './SearchBoxContainer';
import { setSearchBox, useSearchBox } from 'board/tag/store/SearchBoxStore';
import { getEmptySearchBox } from 'board/tag/model/SearchBox';
import { requestFindAllConcept, selectField } from 'board/tag/service/requestTag';

const BREADCRUMB_PATH = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Term', content: 'Term 관리', link: true },
  { key: 'Term-2', content: 'Term 관리', active: true },
];
const ConceptListContainer: React.FC = function ConceptListContainer() {
  useEffect(() => {
    setSearchBox(getEmptySearchBox());
    requestFindAllConcept();
  }, []);

  const searchBox = useSearchBox();

  return (
    <Container>
      <div>
        <Breadcrumb icon="right angle" sections={BREADCRUMB_PATH} />
        <Header as="h2">Term 관리</Header>
      </div>
      {searchBox !== undefined && <SearchBoxContainer searchBox={searchBox} />}
      <ConceptListViewContainer />
    </Container>
  );
};

export default ConceptListContainer;
