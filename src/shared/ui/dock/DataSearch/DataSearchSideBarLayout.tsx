import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { reactAutobind } from '@nara.platform/accent';
import { SidebarLayout } from '../../../components';

export const dataSearchUrl = 'data-search';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  children?: any;
}

@reactAutobind
class DataSearchSideBarLayout extends React.Component<Props> {
  //
  render() {
    //
    const { children } = this.props;
    // const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return (
      <SidebarLayout header="데이터 조회" baseUrl={dataSearchUrl} render={children}>
        <SidebarLayout.Section header="[**데이터 조회**]">
          <SidebarLayout.Item text="회사별 뱃지 정보 조회" url="data/badge-list" activeUrl="data/badge-list" />
          <SidebarLayout.Item
            text="사용자별 관심채널 목록"
            url="data/channel-interest"
            activeUrl="data/channel-interest"
          />
          <SidebarLayout.Item text="커뮤니티 멤버 조회" url="data/community-member" activeUrl="data/community-member" />
          <SidebarLayout.Item text="사용자별 즐겨찾기 목록" url="data/favorites" activeUrl="data/favorites" />
          <SidebarLayout.Item text="Cube 학습 이력 조회" url="data/learning-cube" activeUrl="data/learning-cube" />
        </SidebarLayout.Section>
        <SidebarLayout.Section header="Meta 정보">
          <SidebarLayout.Item text="Card Meta 정보 조회" url="data/card-meta" activeUrl="data/card-meta" />
          <SidebarLayout.Item text="Card 강사 정보 조회" url="data/card-instructor" activeUrl="data/card-instructor" />
          <SidebarLayout.Item text="Card 핵인싸과정 정보 조회" url="data/card-permitted" activeUrl="data/card-permitted" />
          <SidebarLayout.Item text="Card 선수과정 정보 조회" url="data/card-prerequisite" activeUrl="data/card-prerequisite" />
          <SidebarLayout.Item text="Cube Meta 정보 조회" url="data/cube-meta" activeUrl="data/cube-meta" />
          <SidebarLayout.Item text="Cube 강사 정보 조회" url="data/cube-instructor" activeUrl="data/cube-instructor" />
          <SidebarLayout.Item text="Cube 유료과정 조회" url="data/cube-classroom" activeUrl="data/cube-classroom" />
          <SidebarLayout.Item text="Card-Cube Mapping 조회" url="data/card-cube-mapping" activeUrl="data/card-cube-mapping" />
          <SidebarLayout.Item text="Card-Badge Mapping 조회" url="data/meta-badge" activeUrl="data/meta-badge" />
        </SidebarLayout.Section>
      </SidebarLayout>
    );
  }
}

export default withRouter(DataSearchSideBarLayout);
