import * as React from 'react';
import { withRouter } from 'react-router';
import { Container, Form, Tab } from 'semantic-ui-react';
import MemberTempProcContainer from './MemberTempProcContainer';
import MemberMemberListContainer from './MemberListContainer';
//import MemberMemberGroupListContainer from './MemberGroupListContainer';
import GroupListContainer from '../../../group/ui/logic/GroupListContainer';
import MemberListContainer from './MemberListContainer';
import { RouteComponentProps } from 'react-router-dom';
import CreateGroupBasicInfoContainer from '../../../group/ui/logic/CreateGroupBasicInfoContainer';
import { useHistory } from 'react-router-dom';

interface CreateMemberMemberInfoContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
    communityId: string;
    postId: string;
    tab: string;
    view: string;
  }> {}
const CreateMemberMemberInfoContainer: React.FC<CreateMemberMemberInfoContainerProps> = function CreateMemberMemberInfoContainer(
  props
) {
  const history = useHistory();

  function changeTab(data: any) {
    if (data.activeIndex == 3) {
      history.push(
        `/cineroom/${props.match.params.cineroomId}/community-management/community/group/list/group-list/${props.match.params.communityId}`
      );
    }
    setActiveIndex(data.activeIndex);
  }

  const [activeIndex, setActiveIndex] = React.useState<string | number | undefined>(
    props.match.params.tab && props.match.params.tab == 'group' ? 3 : 0
  );

  function getOpenedPanes() {
    return [
      {
        menuItem: '멤버',
        render: () => (
          <Tab.Pane attached={false}>
            <MemberListContainer communityId={props.match.params.communityId} state="APPROVED" groupId="" />
          </Tab.Pane>
        ),
      },
      {
        menuItem: '가입 대기',
        render: () => (
          <Tab.Pane attached={false}>
            <MemberListContainer communityId={props.match.params.communityId} state="WAITING" groupId="" />
          </Tab.Pane>
        ),
      },
      {
        menuItem: '멤버 일괄 등록',
        render: () => (
          <Tab.Pane attached={false}>
            <MemberTempProcContainer communityId={props.match.params.communityId} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: '그룹',
        render: () => {
          return props.match.params.tab && props.match.params.tab == 'group' && props.match.params.view != 'list' ? (
            <Tab.Pane attached={false}>
              <CreateGroupBasicInfoContainer communityId={props.match.params.communityId} />
            </Tab.Pane>
          ) : (
            <Tab.Pane attached={false}>
              <GroupListContainer communityId={props.match.params.communityId} />
            </Tab.Pane>
          );
        },
      },
    ];
  }

  return (
    <Container fluid>
      <Form>
        <Tab
          panes={getOpenedPanes()}
          menu={{ secondary: true, pointing: true }}
          activeIndex={activeIndex}
          className="styled-tab"
          //onTabChange={(e: any, data: any) => setActiveIndex(data.activeIndex)}
          onTabChange={(e: any, data: any) => {
            changeTab(data);
          }}
        />
      </Form>
    </Container>
  );
};

export default withRouter(CreateMemberMemberInfoContainer);
