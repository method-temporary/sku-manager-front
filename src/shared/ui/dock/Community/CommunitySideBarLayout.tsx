import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { reactAutobind } from '@nara.platform/accent';

import { communityManagementUrl } from '../../../../Routes';
import { SidebarLayout } from '../../../components';
import { MenuAuthority } from '../authority/MenuAuthority';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  children?: any;
}

@reactAutobind
class CommunitySideBarLayout extends React.Component<Props> {
  //

  render() {
    const { children } = this.props;

    return (
      <SidebarLayout header="Community 관리" baseUrl={communityManagementUrl} render={children}>
        <SidebarLayout.Section header="Community 관리">
          <SidebarLayout.Item text="Community 관리" url="community/community-list" activeUrl="community/" />
          <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
            <SidebarLayout.Item text="분야 관리" url="community-field/field-list" activeUrl="community-field" />
          </MenuAuthority>
        </SidebarLayout.Section>
      </SidebarLayout>
    );
  }
}

export default withRouter(CommunitySideBarLayout);
