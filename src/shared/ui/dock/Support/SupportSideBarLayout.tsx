import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import * as React from 'react';
import { serviceManagementUrl } from '../../../../Routes';
import { SidebarLayout } from '../../../components';
import { MenuAuthority } from '../authority/MenuAuthority';

@reactAutobind
class SupportSideBarLayout extends ReactComponent {
  //
  render() {
    const { children } = this.props;
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return (
      <SidebarLayout header="서비스 관리" baseUrl={serviceManagementUrl} render={children}>
        {/* 20022-02 김민준 권한 변경  */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
          {/* {!roles.includes('CompanyManager') && ( */}
          <SidebarLayout.Section header="공지사항 관리">
            <SidebarLayout.Item text="공지사항 관리" url="boards/notice-list" activeUrl="boards/notice" />
          </SidebarLayout.Section>
          {/* )} */}
        </MenuAuthority>
        <SidebarLayout.Section header="Support 관리">
          {/* 20022-02 김민준 권한 변경  */}
          <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
            {/* {!roles.includes('CompanyManager') && ( */}
            <SidebarLayout.Item text="카테고리 관리" url="supports/category-list" activeUrl="supports/category" />
            <SidebarLayout.Item text="문의 담당자 관리" url="supports/operator-list" activeUrl="supports/operator" />
            {/* )} */}
          </MenuAuthority>
          <SidebarLayout.Item text="문의 관리" url="supports/qna-list" activeUrl="supports/qna" />
          {/* 20022-02 김민준 권한 변경  */}
          <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
            {/* {!roles.includes('CompanyManager') && ( */}
            <SidebarLayout.Item text="FAQ 관리" url="supports/faq-list" activeUrl="supports/faq" />
            {/* )} */}
          </MenuAuthority>
        </SidebarLayout.Section>
        {/* 20022-02 김민준 권한 변경  */}
        {/* {!roles.includes('CompanyManager') && ( */}
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
          <SidebarLayout.Section header="Tag 관리">
            <SidebarLayout.Item text="Tag 관리" url="boards/tag-list" activeUrl="boards/tag" />
          </SidebarLayout.Section>
          <SidebarLayout.Section header="Term 관리">
            <SidebarLayout.Item text="Term 관리" url="boards/term-list" activeUrl="boards/term" />
          </SidebarLayout.Section>
          <SidebarLayout.Section header="교육기관 관리">
            <SidebarLayout.Item
              text="교육기관 관리"
              url="boards/contentsProvider-list"
              activeUrl="boards/contentsProvider"
            />
          </SidebarLayout.Section>
        </MenuAuthority>
        <SidebarLayout.Section header="발송 관리">
          {/* {(roles.includes('CollegeManager') || roles.includes('SuperManager')) && ( */}
          <SidebarLayout.Item text="메일 발송 관리" url="boards/result-mail" activeUrl="boards/result" />
          <SidebarLayout.Item text="SMS 발송 관리" url="boards/sms-management" activeUrl="boards/sms-management" />
          {/* )} */}
          {/* <SidebarLayout.Item
            text="SMS 발신자 관리"
            url="boards/sms-sender-management"
            activeUrl="boards/sms-sender-management"
          /> */}
          <MenuAuthority permissionAuth={{ isSuperManager: true }}>
            <SidebarLayout.Item
              text="SMS 대표번호 관리"
              url="boards/sms-mainnumber-management"
              activeUrl="boards/sms-mainnumber-management"
            />
          </MenuAuthority>
        </SidebarLayout.Section>
        {/* )} */}
        <SidebarLayout.Section header="Category 관리">
          <SidebarLayout.Item text="Category 관리" url="college/college-list" />
          <SidebarLayout.Item text="Category 순서 관리" url="college/college-sequence" />
        </SidebarLayout.Section>
        <MenuAuthority permissionAuth={{ isSuperManager: true, isCollegeManager: true }}>
          <SidebarLayout.Section header="다국어 관리">
            <SidebarLayout.Item text="레이블 관리" url="boards/label-management" />
          </SidebarLayout.Section>
          <SidebarLayout.Section header="기타 관리">
            <SidebarLayout.Item text="출석 이벤트 조회" url="boards/attende" activeUrl="boards/attende" />
          </SidebarLayout.Section>
          <SidebarLayout.Section header="검색 관리">
            <SidebarLayout.Item
              text="연관 검색어 관리"
              url="boards/related-keyword"
              activeUrl="boards/related-keyword"
            />
          </SidebarLayout.Section>
        </MenuAuthority>
      </SidebarLayout>
    );
  }
}

export default SupportSideBarLayout;
