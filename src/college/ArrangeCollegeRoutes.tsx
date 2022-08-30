import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';

import { DisplaySideBarLayout } from 'shared/ui';
import { CollegeBannerListContainer, CreateCollegeBannerContainer } from './index';
import CollegeOrganizationListContainer from '../arrange/collegeOrganization/ui/logic/CollegeOrganizationListContainer';

class ArrangeCollegeRoutes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <DisplaySideBarLayout>
              {/* College 과정 편성관리 */}
              <Route
                exact
                path={`${match.path}/college-organization-list`}
                component={CollegeOrganizationListContainer}
              />
              {/* College Banner 관리 */}
              <Route exact path={`${match.path}/college-banner-list`} component={CollegeBannerListContainer} />
              <Route exact path={`${match.path}/college-banner-create`} component={CreateCollegeBannerContainer} />
              <Route
                exact
                path={`${match.path}/college-banner-detail/:collegeBannerId`}
                component={CreateCollegeBannerContainer}
              />
            </DisplaySideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default ArrangeCollegeRoutes;
