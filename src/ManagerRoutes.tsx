import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { isTranslator } from 'lib/common';
import { Routes as ToktokRoutes } from './arrange/toktok/Routes';
import { withSplitting, ManagerLayout } from 'shared/ui';

export function ManagerRoutes() {
  const match = useRouteMatch();
  const maybeTranslator = isTranslator();

  if (maybeTranslator) {
    return (
      <Redirect
        to={{
          pathname: '/error',
          state: { devMessage: '권한 없음' },
        }}
      />
    );
  }

  return (
    <ManagerLayout>
      <Switch>
        <Route
          path={`${match.path}/learning-management/cubes`}
          component={withSplitting(() => import('./cube/cube/Routes'))}
        />
        <Route
          path={`${match.path}/learning-management/exams`}
          component={withSplitting(() => import('./exam/Routes'))}
        />
        <Route
          path={`${match.path}/learning-management/cards`}
          component={withSplitting(() => import('./card/Routes'))}
        />
        <Route
          path={`${match.path}/learning-management/card-approval`}
          component={withSplitting(() => import('./card/Routes'))}
        />
        <Route
          path={`${match.path}/learning-management/surveys`}
          component={withSplitting(() => import('./survey/Routes'))}
        />
        <Route
          path={`${match.path}/learning-management/transcripts`}
          component={withSplitting(() => import('./transcript/Routes'))}
        />
        <Route
          path={`${match.path}/learning-management/capability`}
          component={withSplitting(() => import('./capability/Routes'))}
        />
        <Route
          path={`${match.path}/community-management/community`}
          component={withSplitting(() => import('./community/Routes'))}
        />
        <Route
          path={`${match.path}/community-management/community-field`}
          component={withSplitting(() => import('./community/Routes'))}
        />
        <Route
          path={`${match.path}/service-management/boards`}
          component={withSplitting(() => import('./cube/board/Routes'))}
        />
        <Route
          path={`${match.path}/user-management/instructors`}
          component={withSplitting(() => import('./instructor/Routes'))}
        />
        <Route
          path={`${match.path}/user-management/userWorkspace`}
          component={withSplitting(() => import('./userworkspace/Routes'))}
        />
        <Route path={`${match.path}/user-management/user`} component={withSplitting(() => import('./user/Routes'))} />
        <Route
          path={`${match.path}/user-management/usergroup`}
          component={withSplitting(() => import('./usergroup/Routes'))}
        />
        <Route
          path={`${match.path}/user-management/usergroup-category`}
          component={withSplitting(() => import('./usergroup/Routes'))}
        />
        <Route
          path={`${match.path}/learning-management/learning-state`}
          component={withSplitting(() => import('./lecture/Routes'))}
        />
        <Route
          path={`${match.path}/certification-management`}
          component={withSplitting(() => import('./certification/Routes'))}
        />

        <Route
          path={`${match.path}/arrange-management/element`}
          component={withSplitting(() => import('./pageelement/Routes'))}
        />

        <Route
          path={`${match.path}/arrange-management/cardBundle`}
          component={withSplitting(() => import('./cardbundle/Routes'))}
        />

        <Route
          path={`${match.path}/arrange-management/cardBundle-sequence`}
          component={withSplitting(() => import('./cardbundle/Routes'))}
        />

        <Route
          path={`${match.path}/arrange-management/banners`}
          component={withSplitting(() => import('./banner/Routes'))}
        />

        <Route
          path={`${match.path}/arrange-management/bannerBundles`}
          component={withSplitting(() => import('./banner/Routes'))}
        />

        <Route
          path={`${match.path}/arrange-management/college`}
          component={withSplitting(() => import('./college/ArrangeCollegeRoutes'))}
        />

        <Route
          path={`${match.path}/service-management/college`}
          component={withSplitting(() => import('./college/ServiceCollegeRoutes'))}
        />

        <Route
          path={`${match.path}/arrange-management/pageElement`}
          component={withSplitting(() => import('./pageelement/Routes'))}
        />

        <Route
          path={`${match.path}/arrange-management/dash-board`}
          component={withSplitting(() => import('./dashBoard/Routes'))}
        />

        <Route
          path={`${match.path}/arrange-management/popup`}
          component={withSplitting(() => import('./popup/Routes'))}
        />

        <Route path={`${match.path}/arrange-management/content`} component={ToktokRoutes} />
        <Route
          path={`${match.path}/learning-management/approves`}
          component={withSplitting(() => import('./approval/Routes'))}
        />

        <Route path={`${match.path}/example`} component={withSplitting(() => import('./shared/example/Routes'))} />

        <Route
          path={`${match.path}/service-management/supports`}
          component={withSplitting(() => import('./support/Routes'))}
        />

        <Route path={`${match.path}/data-search`} component={withSplitting(() => import('./dataSearch/Routes'))} />
        <Route
          path={`${match.path}/user-management/learning-statistics`}
          component={withSplitting(() => import('./statistics/Routes'))}
        />
        <Route
          path={`${match.path}/translation-management/cubes`}
          component={withSplitting(() => import('./translation/cube/cube/Routes'))}
        />
        <Route
          path={`${match.path}/translation-management/cards`}
          component={withSplitting(() => import('./translation/card/card/Routes'))}
        />
      </Switch>
    </ManagerLayout>
  );
}
