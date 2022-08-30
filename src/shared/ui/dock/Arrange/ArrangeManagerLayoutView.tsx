import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { reactAutobind } from '@nara.platform/accent';

import ArrangeSideBar from './ArrangeSideBar';


interface Props extends RouteComponentProps{
  children?: any

}
@reactAutobind
class ArrangeManagerLayoutView extends React.Component<Props> {
  //
  render() {
    const { children } = this.props;

    return (
      <div className="flex">
        <ArrangeSideBar />
        {children}
      </div>
    );
  }
}

export default withRouter(ArrangeManagerLayoutView);
