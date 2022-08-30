import React from 'react';
import { Container } from 'semantic-ui-react';
import { PageTitle } from '../shared/components';
import { observer } from 'mobx-react';
import CapabilitySearchBox from './components/searchBox/CapabilitySearchBox';
import CapabilityList from './components/list/CapabilityList';
import ExcelDownload from './components/ExcelDownload';

const Capability = observer(() => {
  const capabilityCrumb = [
    { key: 'Home', content: 'HOME', active: false, link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Capability', content: '역랑 관리', active: false, link: true },
    { key: 'CapabilityList', content: '사전 진단', active: true },
  ];

  return (
    <Container>
      <PageTitle breadcrumb={capabilityCrumb} />
      <CapabilitySearchBox />
      <ExcelDownload />
      <CapabilityList />
    </Container>
  );
});

export default Capability;
