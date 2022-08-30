import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { ProfileSideBarLayout } from 'shared/ui';

import UserGroupCategoryContainer from './category/ui/logic/UserGroupCategoryContainer';
import UserGroupCategoryCreateContainer from './category/ui/logic/UserGroupCategoryCreateContainer';
import UserGroupCategoryDetailContainer from './category/ui/logic/UserGroupCategoryDetailContainer';
import UserGroupContainer from './group/ui/logic/UserGruopContainer';
import UserGroupCreateContainer from './group/ui/logic/UserGroupCreateContainer';
import UserGroupDetailContainer from './group/ui/logic/UserGroupDetailContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <ProfileSideBarLayout>
              <Route exact path={`${match.path}/user-group-category-list`} component={UserGroupCategoryContainer} />
              <Route
                exact
                path={`${match.path}/user-group-category-create`}
                component={UserGroupCategoryCreateContainer}
              />
              <Route
                exact
                path={`${match.path}/user-group-category-detail/:userGroupCategoryId`}
                component={UserGroupCategoryDetailContainer}
              />
              <Route
                exact
                path={`${match.path}/user-group-category-modify/:userGroupCategoryId`}
                component={UserGroupCategoryCreateContainer}
              />

              <Route exact path={`${match.path}/user-group-list`} component={UserGroupContainer} />
              <Route exact path={`${match.path}/user-group-create`} component={UserGroupCreateContainer} />
              <Route exact path={`${match.path}/user-group-detail/:userGroupId`} component={UserGroupDetailContainer} />
              <Route exact path={`${match.path}/user-group-modify/:userGroupId`} component={UserGroupCreateContainer} />
            </ProfileSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
