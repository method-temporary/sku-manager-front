import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import {
  CreateBannerContainer,
  DetailBannerContainer,
  OrganizationListContainer,
  CreateBannerBundleContainer,
  DetailBannerBundleContainer,
} from './index';

import BannerListContainer from './ui/logic/BannerListContainer';
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
              {/* Banner 등록관리 */}
              <Route exact path={`${match.path}/banner-list`} component={BannerListContainer} />
              <Route exact path={`${match.path}/banner-create`} component={CreateBannerContainer} />
              <Route exact path={`${match.path}/banner-detail/:bannerId`} component={DetailBannerContainer} />

              {/* Banner 편성관리 */}
              <Route exact path={`${match.path}/bannerBundle-list`} component={OrganizationListContainer} />
              <Route exact path={`${match.path}/bannerBundle-create`} component={CreateBannerBundleContainer} />
              <Route
                exact
                path={`${match.path}/bannerBundle-detail/:bannerBundleId`}
                component={DetailBannerBundleContainer}
              />
            </DisplaySideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
