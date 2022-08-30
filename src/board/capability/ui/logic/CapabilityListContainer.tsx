import React, { useEffect } from 'react';
import { Breadcrumb, Container, Header } from 'semantic-ui-react';
import CapabilityListViewContainer from './CapabilityListViewContainer';
import SearchBoxContainer from './SearchBoxContainer';
import { setSearchBox, useSearchBox } from 'board/capability/store/SearchBoxStore';
import { getEmptySearchBox } from 'board/capability/model/SearchBox';
import { requestFindAllCapability, selectField } from 'board/capability/service/requestCapability';

const BREADCRUMB_PATH = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Tag', content: '역량 관리', active: true },
];
const CapabilityListContainer: React.FC = function CapabilityListContainer() {
  useEffect(() => {
    setSearchBox(getEmptySearchBox());
    requestFindAllCapability();
  }, []);

  const searchBox = useSearchBox();

  return (
    <Container>
      <div>
        <Breadcrumb icon="right angle" sections={BREADCRUMB_PATH} />
        <Header as="h2">역량 관리</Header>
      </div>
      {searchBox !== undefined && <SearchBoxContainer searchBox={searchBox} />}
      <CapabilityListViewContainer />
    </Container>
  );
};

export default CapabilityListContainer;
