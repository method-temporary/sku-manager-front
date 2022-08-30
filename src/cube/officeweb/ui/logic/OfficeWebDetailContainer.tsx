import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { OfficeWebService } from '../../index';
import OfficeWebDetailView from '../view/OfficeWebDetailView';

interface Props extends RouteComponentProps {
  officeWebService?: OfficeWebService
  filesMap: Map<string, any>
  structureType?: string
}

@inject('officeWebService')
@observer
@reactAutobind
class OfficeWebDetailContainer extends React.Component<Props> {
  render() {
    const { officeWeb } = this.props.officeWebService || {} as OfficeWebService;
    const { filesMap, structureType } = this.props;
    return (
      <OfficeWebDetailView
        officeWeb={officeWeb}
        filesMap={filesMap}
        structureType={structureType}
      />
    );
  }
}

export default withRouter(OfficeWebDetailContainer);
