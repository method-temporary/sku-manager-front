import React from 'react';
import { Breadcrumb, Container, Header } from 'semantic-ui-react';
import SearchTagListViewContainer from './SearchTagListViewContainer';
import SearchBox from './SearchBox';
import { SelectType } from 'shared/model';

const SearchTagListContainer: React.FC = function SearchTagListContainer() {
  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={SelectType.pathForTag} />
        <Header as="h2">Tag 관리</Header>
      </div>
      <SearchBox />
      <SearchTagListViewContainer />
    </Container>
  );
};

export default SearchTagListContainer;
