import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';

import { ProfileSideBarLayout } from 'shared/ui';
import InstructorListContainer from './instructor/ui/logic/InstructorListContainer';
import InstructorCreateContainer from './instructor/ui/logic/InstructorCreateContainer';
import InstructorDetailContainer from './instructor/ui/logic/InstructorDetailContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <ProfileSideBarLayout>
              <Route exact path={`${match.path}/instructor-list`} component={InstructorListContainer} />
              <Route exact path={`${match.path}/instructor-create`} component={InstructorCreateContainer} />
              <Route
                exact
                path={`${match.path}/instructor-detail/:instructorId`}
                component={InstructorDetailContainer}
              />
              <Route
                exact
                path={`${match.path}/instructor-modify/:instructorId`}
                component={InstructorCreateContainer}
              />
            </ProfileSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
