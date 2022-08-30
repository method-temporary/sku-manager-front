import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { DisplaySideBarLayout } from 'shared/ui';
import MainPagePopupListContainer from './MainPagePopup/ui/logic/MainPagePopupListContainer';
import CreateMainPagePopupContainer from './MainPagePopup/ui/logic/CreateMainPagePopupContainer';
import MainPagePopupDetailContainer from './MainPagePopup/ui/logic/MainPagePopupDetailContainer';
import ModifyMainPagePopupContainer from './MainPagePopup/ui/logic/ModifyMainPagePopupContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <DisplaySideBarLayout>
              <Route exact path={`${match.path}/mainPagePopup`} component={MainPagePopupListContainer} />
              <Route exact path={`${match.path}/mainPagePopup/create`} component={CreateMainPagePopupContainer} />
              <Route
                exact
                path={`${match.path}/mainPagePopup/modify/:popupId`}
                component={ModifyMainPagePopupContainer}
              />
              <Route
                exact
                path={`${match.path}/mainPagePopup/detail/:popupId`}
                component={MainPagePopupDetailContainer}
              />
            </DisplaySideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
