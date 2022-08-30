import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SidebarLayout } from '../../../components';
import { exampleUrl } from '../../../../Routes';

@reactAutobind
class ExampleLayout extends ReactComponent {
  //
  render() {
    //
    const { children } = this.props;

    return (
      <SidebarLayout header="컴포넌트 예제" baseUrl={exampleUrl} render={children}>
        <SidebarLayout.Section header="기본 컴포넌트">
          <SidebarLayout.Item text="PageTitle" url="page-title" />
          <SidebarLayout.Item text="SubActions" url="sub-actions" />
          <SidebarLayout.Item text="RadioGroup" url="radio-group" />
          <SidebarLayout.Item text="FormTable" url="form-table" />
          <SidebarLayout.Item text="Alert-Confirm" url="alert-confirm" />
          <SidebarLayout.Item text="Loader" url="loader" />
          <SidebarLayout.Item text="CrossEditor" url="crosseditor" />
        </SidebarLayout.Section>
        <SidebarLayout.Section header="복합 컴포넌트">
          <SidebarLayout.Item text="AccessRuleSettings" url="access-rule-settings" />
          <SidebarLayout.Item text="UserGroupSelect" url="user-group-select" />
          <SidebarLayout.Item text="UserGroupSelectModal" url="user-group-select-modal" />
          <SidebarLayout.Item text="CardSelectModal" url="card-select-modal" />
          <SidebarLayout.Item text="SearchBox" url="searchbox" />
          <SidebarLayout.Item text="Polyglot" url="polyglot" />
        </SidebarLayout.Section>
      </SidebarLayout>
    );
  }
}

export default ExampleLayout;
