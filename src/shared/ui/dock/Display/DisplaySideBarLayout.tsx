import { reactAutobind } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { displayManagementUrl } from 'Routes';
import { SidebarLayout } from '../../../components';
import { MenuAuthority } from '../authority/MenuAuthority';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  children?: any;
}

@reactAutobind
class DisplaySideBarLayout extends React.Component<Props> {
  //
  render() {
    //
    const { children } = this.props;
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return (
      <SidebarLayout header="전시 관리" baseUrl={displayManagementUrl} render={children}>
        {/* 20022-02 김민준 권한 변경  */}
        {/* {isSuperManager() || roles.includes('CompanyManager') || roles.includes('CollegeManager') ? ( */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true, isCompanyManager: true }}>
          <SidebarLayout.Section header="Card 묶음 편성">
            <SidebarLayout.Item
              text="카드 묶음 관리"
              url="cardBundle/cardBundle-list"
              activeUrl="cardBundle/cardBundle"
            />
            <SidebarLayout.Item text="카드 묶음 순서 관리" url="cardBundle-sequence" />
          </SidebarLayout.Section>
        </MenuAuthority>
        {/* ) : null} */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true, isCompanyManager: true }}>
          <SidebarLayout.Section header="Banner 관리">
            <SidebarLayout.Item text="Banner 등록관리" url="banners/banner-list" activeUrl="banners/banner" />
            <SidebarLayout.Item
              text="Banner 편성관리"
              url="bannerBundles/bannerBundle-list"
              activeUrl="bannerBundles/bannerBundle"
            />
          </SidebarLayout.Section>
        </MenuAuthority>
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true, isCompanyManager: true }}>
          {/* {isSuperManager() || roles.includes('CollegeManager') ? ( */}
          <SidebarLayout.Section header="Main 카테고리 관리">
            <SidebarLayout.Item text="학습카드 순서관리" url="college/college-organization-list" />
            <SidebarLayout.Item
              text="Category Banner 관리"
              url="college/college-banner-list"
              activeUrl="college/college-banner"
            />
          </SidebarLayout.Section>
        </MenuAuthority>
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
          <SidebarLayout.Section header="화면 관리">
            <SidebarLayout.Item
              text="화면 요소 관리"
              url="pageElement/pageElement-list"
              activeUrl="pageElement/pageElement"
            />
          </SidebarLayout.Section>
          <SidebarLayout.Section header="대시보드 관리">
            <SidebarLayout.Item
              text="대시보드 문구 관리"
              url="dash-board/dash-board-sentence"
              activeUrl="dash-board/dash-board-sentence"
            />
          </SidebarLayout.Section>
          {/* ) : null} */}
        </MenuAuthority>
        <MenuAuthority permissionAuth={{ isSuperManager: true }}>
          <SidebarLayout.Section header="팝업 관리">
            <SidebarLayout.Item text="팝업 관리" url="popup/mainPagePopup" activeUrl="popup/mainPagePopup" />
          </SidebarLayout.Section>
        </MenuAuthority>

        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
          <SidebarLayout.Section header="Content 관리">
            <SidebarLayout.Item text="toktok" url="content/toktok" activeUrl="content/toktok" />
          </SidebarLayout.Section>
        </MenuAuthority>
      </SidebarLayout>
    );
  }
}

export default withRouter(DisplaySideBarLayout);
