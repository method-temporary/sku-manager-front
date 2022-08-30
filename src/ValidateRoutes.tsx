import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { patronInfo } from '@nara.platform/dock';
import { validateAccessTokenExp, hasCineroomWorkspaces, logoutClick, cineroomIdFromUrl } from 'lib/common';
import { TranslationRoutes } from 'TranslatorRoutes';
import { ManagerRoutes } from 'ManagerRoutes';
import NoAuthPage from 'pages/NoAuthPage';

export function ValidateRoutes() {
  const currentCineroomId = patronInfo.getCineroomId();
  const cineroomIdUrl = cineroomIdFromUrl();

  useEffect(() => {
    if (currentCineroomId !== cineroomIdUrl) {
      patronInfo.setCineroomId(cineroomIdUrl);
    }
  }, [currentCineroomId, cineroomIdUrl]);

  if (validateAccessTokenExp()) {
    if (currentCineroomId && !hasCineroomWorkspaces(currentCineroomId)) {
      return (
        <Redirect
          to={{
            pathname: '/error',
            state: { devMessage: 'workspaces 권한 없음' },
          }}
        />
      );
    }
  }

  if (!validateAccessTokenExp()) {
    if (`${process.env.NODE_ENV}` !== 'development') {
      logoutClick();
      return <Redirect to="/" />;
    } else {
      return (
        <Redirect
          to={{
            pathname: '/error',
            state: { devMessage: 'token 만료' },
          }}
        />
      );
    }
  }

  return (
    <Switch>
      <Route exact path="/cineroom/:cineroomId/translation-management*" component={TranslationRoutes} />
      <Route path="/cineroom/:cineroomId" component={ManagerRoutes} />
      <Route component={NoAuthPage} />
    </Switch>
  );
}
