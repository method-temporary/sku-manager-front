import React from 'react';
import { RouteComponentProps, Route } from 'react-router-dom';
import { LearningSideBarLayout } from 'shared/ui';
import { TestCreatePage } from './ui/page/TestCreatePage';
import { TestManagementPage } from './ui/page/TestManagementPage';
import { TestDetailPage } from './ui/page/TestDetailPage';
import { setTestRoutePath } from './store/TestRoutePathStore';
import { TestEditPage } from './ui/page/TestEditPage';

class Routes extends React.PureComponent<RouteComponentProps> {
  componentDidMount() {
    const { match } = this.props;
    setTestRoutePath({
      path: match.url,
    });
  }

  render() {
    const { match } = this.props;
    return (
      <Route
        path={`${match.path}`}
        component={({ match }: any) => (
          <LearningSideBarLayout>
            <Route exact path={`${match.path}`} component={TestManagementPage} />
            <Route exact path={`${match.path}/:testId/detail`} component={TestDetailPage} />
            <Route exact path={`${match.path}/create`} component={TestCreatePage} />
            <Route exact path={`${match.path}/:testId/edit`} component={TestEditPage} />
          </LearningSideBarLayout>
        )}
      />
    );
  }
}

export default Routes;
