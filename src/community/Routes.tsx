import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { CommunitySideBarLayout } from 'shared/ui';

import CommunityListContainer from './community/ui/logic/CommunityListContainer';
import CommunityDetailContainer from './community/ui/logic/CommunityDetailContainer';
import FieldListContainer from './field/ui/logic/FieldListContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <CommunitySideBarLayout>
              {/* Community 관리*/}
              <Route exact path={`${match.path}/community-list`} component={CommunityListContainer} />
              <Route exact path={`${match.path}/community-create`} component={CommunityDetailContainer} />
              <Route exact path={`${match.path}/community-detail/:communityId`} component={CommunityDetailContainer} />
              <Route
                exact
                path={`${match.path}/board-detail/:communityId/:boardId`}
                component={CommunityDetailContainer}
              />
              <Route
                exact
                path={`${match.path}/:tab/:view/post-list/:communityId`}
                component={CommunityDetailContainer}
              />
              <Route exact path={`${match.path}/:tab/post-create/:communityId`} component={CommunityDetailContainer} />
              <Route
                exact
                path={`${match.path}/:tab/post-detail/:communityId/:postId`}
                component={CommunityDetailContainer}
              />
              <Route
                exact
                path={`${match.path}/:tab/group-detail/:communityId/:groupId`}
                component={CommunityDetailContainer}
              />
              <Route
                exact
                path={`${match.path}/:tab/:view/group-list/:communityId`}
                component={CommunityDetailContainer}
              />
              <Route exact path={`${match.path}/:tab/:view/:communityId`} component={CommunityDetailContainer} />
              {/* <Route
                exact
                path={`${match.path}/:tab/:view/:communityId/:menuId`}
                component={CommunityDetailContainer}
              /> */}
              <Route
                exact
                path={`${match.path}/:tab/survey-detail/:communityId/:surveyCaseId/:surveyFormId`}
                component={CommunityDetailContainer}
              />

              {/* 분야 관리*/}
              <Route exact path={`${match.path}/field-list`} component={FieldListContainer} />
            </CommunitySideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
