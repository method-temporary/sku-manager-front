import React from 'react';
import { Segment, List, Header } from 'semantic-ui-react';

interface MenuManagementIntroViewProps {}

const MenuManagementIntroView: React.FC<MenuManagementIntroViewProps> = function MenuManagementIntroView() {
  return (
    <Segment basic>
      <Header size="medium">메뉴 관리 안내</Header>
      <List bulleted>
        <List.Item>&lt;메뉴&gt;를 편집한 후에 &lt;저장&gt; 버튼을 눌러야 반영됩니다.</List.Item>
        <List.Item>&lt;Home&gt;, &lt;전체 글&gt;, &lt;공지사항&gt; 메뉴는 편집 및 삭제가 불가합니다.</List.Item>
      </List>
    </Segment>
  );
};

export default MenuManagementIntroView;
