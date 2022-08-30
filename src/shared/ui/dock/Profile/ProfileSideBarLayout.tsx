import React from 'react';
import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { isSuperManager } from 'shared/ui';
import { userManagementUrl } from '../../../../Routes';
import { SidebarLayout } from '../../../components';
import { MenuAuthority } from '../authority/MenuAuthority';

@reactAutobind
class ProfileSideBarLayout extends ReactComponent {
  //
  render() {
    //
    const { children } = this.props;
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());
    const cineroomId = patronInfo.getCineroomId();

    return (
      <SidebarLayout header="회원 관리" baseUrl={userManagementUrl} render={children}>
        {/* 20022-02 김민준 권한 변경  */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
          <SidebarLayout.Section header="강사 관리">
            <SidebarLayout.Item text="강사 관리" url="instructors/instructor-list" activeUrl="instructors/instructor" />
          </SidebarLayout.Section>
        </MenuAuthority>
        <SidebarLayout.Section header="구성원 관리">
          <SidebarLayout.Item text="구성원 관리" url="user/user-list" activeUrl="user/user" />
        </SidebarLayout.Section>
        <SidebarLayout.Section header="사용자 그룹 관리">
          <SidebarLayout.Item
            text="사용자 그룹 분류 관리"
            url="usergroup-category/user-group-category-list"
            activeUrl="usergroup-category/user-group-category"
          />
          <SidebarLayout.Item
            text="사용자 그룹 관리"
            url="usergroup/user-group-list"
            activeUrl="usergroup/user-group"
          />
        </SidebarLayout.Section>

        {/* 20022-02 김민준 권한 변경  */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCompanyManager: true }}>
          <SidebarLayout.Section header="사용자 소속 관리">
            <SidebarLayout.Item
              text="사용자 소속 관리"
              url={
                isSuperManager()
                  ? 'userWorkspace/userWorkspace-list'
                  : `userWorkspace/userWorkspace-detail/${patronInfo.getCineroomId()}`
              }
              activeUrl="userWorkspace/userWorkspace-list"
            />
          </SidebarLayout.Section>
        </MenuAuthority>
        <SidebarLayout.Section header="통계">
          <SidebarLayout.Item
            text="멤버십 학습 통계"
            url="learning-statistics/membership"
            activeUrl="learning-statistics"
          />
        </SidebarLayout.Section>
      </SidebarLayout>
    );
  }
}

export default ProfileSideBarLayout;
