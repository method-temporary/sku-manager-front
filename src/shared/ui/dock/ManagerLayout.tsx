import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { reactAutobind } from '@nara.platform/accent';
import ManagerLayoutView from './ManagerLayoutView';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  children?: any;
}

@observer
@reactAutobind
class ManagerLayout extends React.Component<Props> {
  render() {
    return <ManagerLayoutView>{this.props.children}</ManagerLayoutView>;
  }
}

export default withRouter(ManagerLayout);
