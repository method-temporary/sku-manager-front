import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { UserWorkspaceDetailContainer, UserWorkspaceListContainer } from './index';
import { ProfileSideBarLayout } from 'shared/ui';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <ProfileSideBarLayout>
              {/*사용자 소속 관리*/}
              <Route exact path={`${match.path}/userWorkspace-list`} component={UserWorkspaceListContainer} />
              <Route exact path={`${match.path}/userWorkspace-create`} component={UserWorkspaceDetailContainer} />
              <Route
                exact
                path={`${match.path}/userWorkspace-detail/:userWorkspaceId`}
                component={UserWorkspaceDetailContainer}
              />
            </ProfileSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
