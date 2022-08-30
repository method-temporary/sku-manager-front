import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { PageTitle } from '../components';
import { Header, Container } from 'semantic-ui-react';
import { SelectType } from '../model';

interface State {
  accessLists: any;
}

@reactAutobind
@observer
class SubActionsExample extends ReactComponent<{}, State> {
  //
  render() {
    //
    return (
      <Container fluid>
        <Header size="small">기본 형태</Header>
        <PageTitle breadcrumb={SelectType.sectionProfiles} />

        <Header size="small">Breadcrumb 마지막 항목과 title이 다른 경우</Header>
        <PageTitle breadcrumb={SelectType.sectionProfiles}>Member Basic Info </PageTitle>
      </Container>
    );
  }
}

export default SubActionsExample;
