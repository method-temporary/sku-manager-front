import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { TranslationSideBarLayout } from 'shared/ui';

import { CardCreateContainer, CardListContainer, CardDetailContainer } from './index';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <TranslationSideBarLayout>
              {/*Card 관리*/}
              <Route exact path={`${match.path}/card-list`} component={CardListContainer} />
              <Route exact path={`${match.path}/card-modify/:cardId`} component={CardCreateContainer} />
              <Route exact path={`${match.path}/card-detail/:cardId`} component={CardDetailContainer} />
            </TranslationSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
