import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import AplService from '../../present/logic/AplService';
import AplBasicInfoView from './AplBasicInfoView';

interface Props {
  aplService: AplService;
}

@inject('aplService')
@observer
@reactAutobind
class AplBasicInfoContainer extends React.Component<Props> {

  componentDidMount() {
    //
  }

  render() {
    const { aplService } = this.props;

    return (
      <>
        <AplBasicInfoView
          aplService={aplService}
        />
      </>
    );
  }
}

export default AplBasicInfoContainer;
