import * as React from 'react';
import { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { SupportSideBarLayout } from 'shared/ui';

import { CollegeListContainer, CollegeDetailContainer, CollegeSequenceContainer } from './index';

class ServiceCollegeRoutes extends PureComponent<RouteComponentProps> {
  //
  render() {
    //
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => {
            return (
              <SupportSideBarLayout>
                {/* College Banner 관리 */}
                <Route exact path={`${match.path}/college-list`} component={CollegeListContainer} />
                <Route exact path={`${match.path}/college-detail/:collegeId`} component={CollegeDetailContainer} />
                <Route exact path={`${match.path}/college-create`} component={CollegeDetailContainer} />
                <Route exact path={`${match.path}/college-sequence`} component={CollegeSequenceContainer} />
              </SupportSideBarLayout>
            );
          }}
        />
      </Switch>
    );
  }
}

export default ServiceCollegeRoutes;
