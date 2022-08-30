import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { DisplaySideBarLayout } from 'shared/ui';

import { CardBundleListContainer, CreateCardBundleContainer } from '../cardbundle';
import CardBundleSequenceManagementContainer from '../cardbundle/ui/logic/CardBundleSequenceManagementContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <DisplaySideBarLayout>
              <Route exact path={`${match.path}/cardBundle-list`} component={CardBundleListContainer} />
              <Route exact path={`${match.path}/cardBundle-create`} component={CreateCardBundleContainer} />
              <Route
                exact
                path={`${match.path}/cardBundle-create/:cardBundleId`}
                component={CreateCardBundleContainer}
              />
              <Route exact path={`${match.path}`} component={CardBundleSequenceManagementContainer} />
            </DisplaySideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
