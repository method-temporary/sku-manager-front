import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';

import DashBoardSentenceListContainer from 'dashBoard/ui/logic/DashBoardSentenceListContainer';
import DashBoardSentenceDetailContainer from 'dashBoard/ui/logic/DashBoardSentenceDetailContainer';
import DashBoardSentenceCreateContainer from 'dashBoard/ui/logic/DashBoardSentenceCreateContainer';
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
              <Route exact path={`${match.path}/dash-board-sentence`} component={DashBoardSentenceListContainer} />
              <Route
                exact
                path={`${match.path}/dash-board-sentence-create`}
                component={DashBoardSentenceCreateContainer}
              />
              <Route
                exact
                path={`${match.path}/dash-board-sentence-modify/:id`}
                component={DashBoardSentenceDetailContainer}
              />
            </DisplaySideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
