import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import ElementManagerListContainer from './ui/logic/ElementManagementListContainer';
import ElementManagerCreateContainer from './ui/logic/CreateElementManagementContainer';

import { DisplaySideBarLayout } from 'shared/ui';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <DisplaySideBarLayout>
              <Route exact path={`${match.path}/pageElement-list`} component={ElementManagerListContainer} />
              <Route exact path={`${match.path}/pageElement-create`} component={ElementManagerCreateContainer} />
              <Route
                exact
                path={`${match.path}/pageElement-create/:pageElementId`}
                component={ElementManagerCreateContainer}
              />
            </DisplaySideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
