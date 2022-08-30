import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { LearningSideBarLayout } from 'shared/ui';

import Capability from './Capability';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <LearningSideBarLayout>
              <Route exact path={`${match.path}`} component={Capability} />
            </LearningSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
