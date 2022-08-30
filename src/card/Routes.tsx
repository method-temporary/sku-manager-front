import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { LearningSideBarLayout } from 'shared/ui';

import { CardCreateContainer } from './card';

import CardListPage from './list/CardListPage';
import CardCreatePage from './create/CardCreatePage';
import CardDetailPage from './detail/CardDetailPage';
import CardApprovalListPage from './approval/list/CardApprovalListPage';
import CardApprovalDetailPage from './approval/detail/CardApprovalDetailPage';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <LearningSideBarLayout>
              {/*Card 관리*/}
              <Route exact path={`${match.path}/card-list`} component={CardListPage} />
              <Route exact path={`${match.path}/card-create`} component={CardCreatePage} />
              <Route exact path={`${match.path}/card-detail/:cardId`} component={CardDetailPage} />
              <Route exact path={`${match.path}/card-detail/:cardId/:cubeId`} component={CardDetailPage} />
              <Route exact path={`${match.path}/card-create/copy/:copiedId`} component={CardCreateContainer} />

              {/*Card 승인 관리*/}
              <Route exact path={`${match.path}/card-approval-list`} component={CardApprovalListPage} />
              <Route exact path={`${match.path}/card-approval-detail/:cardId`} component={CardApprovalDetailPage} />
            </LearningSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
