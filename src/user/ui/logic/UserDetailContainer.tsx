import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Container, Tab, Form } from 'semantic-ui-react';
import { SelectType } from 'shared/model';
import { PageTitle } from 'shared/components';
import { useRequestContentsProviders } from 'shared/hooks';
import SkProfileDefaultDetailContainer from './UserDefaultDetailContainer';
import SkProfileTrainingListContainer from './UserTrainingListContainer';
import SkProfileTrainingDetailContainer from './UserTrainingDetailContainer';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  userId: string;
  tab: string;
}

const UserDetailContainer: React.FC<Props> = function SkProfileDetailContainer(props) {
  //
  useRequestContentsProviders();
  const [activeIndex, setActiveIndex] = React.useState<string | number | undefined>(
    props.match.params.tab && props.match.params.tab.indexOf('training') > -1 ? 1 : 0
  );

  function getOpenedPanes() {
    //
    return [
      {
        menuItem: '구성원관리',
        render: () => (
          <Tab.Pane attached={false}>
            <SkProfileDefaultDetailContainer />
          </Tab.Pane>
        ),
      },
      {
        menuItem: '개인학습현황',
        render: () =>
          props.match.params.tab && props.match.params.tab === 'detail-training' ? (
            <Tab.Pane attached={false}>
              <SkProfileTrainingDetailContainer />
            </Tab.Pane>
          ) : (
            <Tab.Pane attached={false}>
              <SkProfileTrainingListContainer />
            </Tab.Pane>
          ),
      },
    ];
  }

  return (
    <Container fluid>
      <PageTitle breadcrumb={SelectType.sectionProfiles} />

      <Form>
        <Tab
          panes={getOpenedPanes()}
          menu={{ secondary: true, pointing: true }}
          activeIndex={activeIndex}
          className="styled-tab tab-wrap"
          onTabChange={(e: any, data: any) => setActiveIndex(data.activeIndex)}
        />
      </Form>
    </Container>
  );
};

export default withRouter(UserDetailContainer);
