import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { isTranslator } from 'lib/common';
import { withSplitting, ManagerLayout } from 'shared/ui';

export function TranslationRoutes() {
  const match = useRouteMatch();
  const maybeTranslator = isTranslator();

  // Translator 권한은 일반 관리자 메뉴 접근 금지
  if (maybeTranslator) {
    return (
      <ManagerLayout>
        <Switch>
          <Route
            path={`${match.path}/cubes`}
            component={withSplitting(() => import('./translation/cube/cube/Routes'))}
          />
          <Route
            path={`${match.path}/cards`}
            component={withSplitting(() => import('./translation/card/card/Routes'))}
          />
        </Switch>
      </ManagerLayout>
    );
  }
  // 일반 관리자 url 직접 입력시 일단 허용
  return (
    <ManagerLayout>
      <Switch>
        <Route path={`${match.path}/cubes`} component={withSplitting(() => import('./translation/cube/cube/Routes'))} />
        <Route path={`${match.path}/cards`} component={withSplitting(() => import('./translation/card/card/Routes'))} />
      </Switch>
    </ManagerLayout>
  );
}
