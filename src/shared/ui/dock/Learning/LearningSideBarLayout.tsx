import * as React from 'react';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SidebarLayout } from '../../../components';
import { learningManagementUrl } from '../../../../Routes';
import { MenuAuthority } from '../authority/MenuAuthority';

@reactAutobind
class LearningSideBarLayout extends ReactComponent {
  //
  render() {
    const { children } = this.props;
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return (
      <SidebarLayout header="Learning 관리" baseUrl={learningManagementUrl} render={children}>
        <SidebarLayout.Section header="과정관리">
          <SidebarLayout.Item text="Cube 관리" url="cubes/cube-list" activeUrl="cubes/cube" />
          <SidebarLayout.Item text="Card 관리" url="cards/card-list" activeUrl="cards/card" />
        </SidebarLayout.Section>

        {/* 20022-02 김민준 권한 변경  */}
        {/* {(isSuperManager() || roles.includes('CompanyManager') || roles.includes('CollegeManager')) && ( */}
        <SidebarLayout.Section header="승인 관리">
          <SidebarLayout.Item
            text="Card 승인 관리"
            url="card-approval/card-approval-list"
            activeUrl="card-approval/card-approval"
          />
          <SidebarLayout.Item text="유료 과정" url="approves/approve-management/paid-course" />
          <SidebarLayout.Item
            text="개인학습과정"
            url="cubes/apl-approve-management/apl-list"
            activeUrl="cubes/apl-approve-management/apl"
          />
        </SidebarLayout.Section>
        {/* )} */}

        {/* <SidebarLayout.Section header="Create 관리">
          <SidebarLayout.Item
            text="Create 관리"
            url="cubes/create-approve-management/approvalContents-list"
            activeUrl="cubes/create-approve-management/approvalContents"
          />
        </SidebarLayout.Section> */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
          <SidebarLayout.Section header="학습상태 관리">
            <SidebarLayout.Item text="LinkedIn 학습완료 처리" url="learning-state/learning-complete-state-upload" />
            <SidebarLayout.Item text="Coursera 학습완료 처리" url="learning-state/coursera" />
          </SidebarLayout.Section>
        </MenuAuthority>

        <SidebarLayout.Section header="Test 관리">
          <SidebarLayout.Item text="Test 관리" url="exams" activeUrl="exams" />
        </SidebarLayout.Section>

        <SidebarLayout.Section header="Survey 관리">
          <SidebarLayout.Item text="Survey 관리" url="surveys" />
        </SidebarLayout.Section>

        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
          <SidebarLayout.Section header="Transcript 관리">
            <SidebarLayout.Item text="Transcript 관리" url="transcripts" />
          </SidebarLayout.Section>
        </MenuAuthority>

        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true, isCompanyManager: true }}>
          <SidebarLayout.Section header="역량 관리">
            <SidebarLayout.Item text="사전 진단" url="capability" />
          </SidebarLayout.Section>
        </MenuAuthority>
      </SidebarLayout>
    );
  }
}

export default LearningSideBarLayout;
