import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind } from '@nara.platform/accent';

import { certificationManagementUrl } from '../../../../Routes';
import { SidebarLayout } from '../../../components';
import { MenuAuthority } from '../authority/MenuAuthority';

interface Props extends RouteComponentProps {
  children?: any;
}
@reactAutobind
class CertificateManagerSideBarLayout extends React.Component<Props> {
  //
  render() {
    const { children } = this.props;
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return (
      <SidebarLayout header="Certification 관리" baseUrl={certificationManagementUrl} render={children}>
        <SidebarLayout.Section header="Badge 관리">
          <SidebarLayout.Item
            text="Badge 분야 관리"
            url="badgeCategory/badge-category-list"
            activeUrl="badgeCategory/badge-category"
          />
          <SidebarLayout.Item text="Badge 관리" url="badges/badge-list" activeUrl="badges/badge" />
        </SidebarLayout.Section>
        {/* 20022-02 김민준 권한 변경  */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, etcAuth: [{ authName: 'BadgeApprover', value: true }] }}>
          {/* 특수한 권한에 대한 처리 */}
          {/* {roles.includes('BadgeApprover') ? ( */}
          <SidebarLayout.Section header="승인 관리">
            {/* {roles.includes('BadgeApprover') ? ( */}
            <SidebarLayout.Item
              text="Badge 승인 관리"
              url="badge-approval/approval-list"
              activeUrl="badge-approval/approval"
            />
            {/* ) : null} */}
            <MenuAuthority permissionAuth={{ isSuperManager: true }}>
              <SidebarLayout.Item text="승인자 관리" url="badge-approver-management/approver-list" />
            </MenuAuthority>
          </SidebarLayout.Section>
          {/* ) : null} */}
        </MenuAuthority>
        <SidebarLayout.Section header="Badge 편성 관리">
          <SidebarLayout.Item text="Badge 편성 관리" url="badge-arrange-management/arrange-list" />
          <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
            {/* {isSuperManager() || roles.includes('CollegeManager') ? ( */}
            <SidebarLayout.Item text="Badge 분야 순서 관리" url="badge-arrange-management/order-list" />
            {/* ) : null} */}
          </MenuAuthority>
        </SidebarLayout.Section>
      </SidebarLayout>
    );
  }
}

export default withRouter(CertificateManagerSideBarLayout);
