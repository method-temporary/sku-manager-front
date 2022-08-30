import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { TranslationSideBarLayout } from 'shared/ui';
import { CubeDetailContainer, CubeListContainer } from './index';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <TranslationSideBarLayout>
              {/*Cube 관리*/}
              <Route exact path={`${match.path}/cube-list`} component={CubeListContainer} />
              <Route exact path={`${match.path}/cube-detail/:cubeId`} component={CubeDetailContainer} />
            </TranslationSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
