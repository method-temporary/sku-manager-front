import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import ExampleLayout from '../ui/dock/Example/ExampleLayout';
import RadioGroupExample from './RadioGroupExample';
import PageTitleExample from './PageTitleExample';
import SubActionsExample from './SubActionsExample';
import FormTableExample from './FormTableExample';
import SearchBoxExample from './SearchBoxExample';
import AlertConfirmExample from './AlertConfirmExample';
import LoaderExample from './LoaderExample';

import AccessRuleSettingsExample from './AccessRuleSettingsExample';
import UserGroupSelectExample from './UserGroupSelectExample';
import UserGroupSelectModalExample from './UserGroupSelectModalExample';
import CardSelectModalExample from './CardSelectModalExample';
import PolyglotExample from './PolyglotExample';
import CrossEditorExample from './CrossEditorExample';

class Routes extends React.PureComponent<RouteComponentProps> {
  //
  render() {
    //
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          render={({ match }: any) => (
            <ExampleLayout>
              {/* 기본 컴포넌트 */}
              <Route exact path={`${match.path}/radio-group`} component={RadioGroupExample} />
              <Route exact path={`${match.path}/page-title`} component={PageTitleExample} />
              <Route exact path={`${match.path}/sub-actions`} component={SubActionsExample} />
              <Route exact path={`${match.path}/form-table`} component={FormTableExample} />
              <Route exact path={`${match.path}/searchbox`} component={SearchBoxExample} />
              <Route exact path={`${match.path}/alert-confirm`} component={AlertConfirmExample} />
              <Route exact path={`${match.path}/loader`} component={LoaderExample} />
              <Route exact path={`${match.path}/crosseditor`} component={CrossEditorExample} />
              {/* 복합 컴포넌트 */}
              <Route exact path={`${match.path}/access-rule-settings`} component={AccessRuleSettingsExample} />
              <Route exact path={`${match.path}/user-group-select`} component={UserGroupSelectExample} />
              <Route exact path={`${match.path}/user-group-select-modal`} component={UserGroupSelectModalExample} />
              <Route exact path={`${match.path}/card-select-modal`} component={CardSelectModalExample} />
              <Route exact path={`${match.path}/polyglot`} component={PolyglotExample} />
            </ExampleLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
