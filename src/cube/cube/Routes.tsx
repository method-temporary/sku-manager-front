import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { CreateCubeContainer, CubeDetailContainer, CubeListContainer } from './index';
import { LearningSideBarLayout } from 'shared/ui';
import AplListContainer from '../../apl/ui/logic/AplListContainer';
import AplDetailContainer from 'apl/ui/logic/AplDetailContainer';
import CreateApprovalManagementListContainer from './ui/logic/CreateApprovalManagementListContainer';
import CreateApprovalManagementDetailContainer from './ui/logic/CreateApprovalManagementDetailContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <LearningSideBarLayout>
              {/*Cube 관리*/}
              <Route exact path={`${match.path}/cube-list`} component={CubeListContainer} />
              <Route exact path={`${match.path}/cube-create`} component={CreateCubeContainer} />
              <Route exact path={`${match.path}/cube-create/copy/:copiedId`} component={CreateCubeContainer} />
              <Route exact path={`${match.path}/cube-detail/:cubeId`} component={CubeDetailContainer} />

              {/*개인학습과정*/}
              <Route exact path={`${match.path}/apl-approve-management/apl-list`} component={AplListContainer} />
              <Route
                exact
                path={`${match.path}/apl-approve-management/apl-detail/:aplId/:aplState`}
                component={AplDetailContainer}
              />
              {/*<Route exact path={`${match.path}/apl-approve-management/apl-detail`} component={AplDetailContainer} />*/}

              {/*Create 관리*/}
              <Route
                exact
                path={`${match.path}/create-approve-management/approvalContents-list`}
                component={CreateApprovalManagementListContainer}
              />
              <Route
                exact
                path={`${match.path}/create-approve-management/approvalContents-detail/:cubeId`}
                component={CreateApprovalManagementDetailContainer}
              />
              {/*<Route exact path={`${match.path}/registIcon`} component={RegisterIconContainer} />*/}
            </LearningSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
