import React, { useEffect } from 'react';
import { Route, Switch, useRouteMatch, useParams } from 'react-router-dom';
import { DisplaySideBarLayout } from 'shared/ui';
import { useRequestWorkspaces } from 'shared/hooks';

import { setPortletRoutePath } from './routePath';
import { PortletCreateContainer } from './portletCreate/PortletCreateContainer';
import { PortletDetailContainer } from './portletDetail/PortletDetailContainer';
import { PortletEditContainer } from './portletEdit/PortletEditContainer';
import { PortletRouteParams, setPortletRouteParams } from './routeParams';
import { PortletManagementContainer } from './portletManagement/PortletManagementContainer';

export function Routes() {
  useRequestWorkspaces();
  const match = useRouteMatch();
  const params = useParams<PortletRouteParams>();

  useEffect(() => {
    setPortletRoutePath({
      path: match.url,
    });
    setPortletRouteParams(params);
  }, []);

  return (
    <Switch>
      <Route
        path={`${match.path}`}
        component={({ match }: any) => (
          <DisplaySideBarLayout>
            <Route exact path={`${match.path}/toktok`} component={PortletManagementContainer} />
            <Route exact path={`${match.path}/toktok/create`} component={PortletCreateContainer} />
            <Route exact path={`${match.path}/toktok/:portletId/edit`} component={PortletEditContainer} />
            <Route exact path={`${match.path}/toktok/:portletId/detail`} component={PortletDetailContainer} />
          </DisplaySideBarLayout>
        )}
      />
    </Switch>
  );
}
