import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import CubeService from 'cube/cube/present/logic/CubeService';
import CubeExposureInfoView from '../view/CubeExposureInfoView';

interface Props {
  onChangeCubeProps: (name: string, value: string | {} | []) => void;
  readonly?: boolean;
}

interface Injected {
  cubeService: CubeService;
}

@inject('cubeService')
@observer
@reactAutobind
class CubeExposureInfoContainer extends ReactComponent<Props, {}, Injected> {

  render() {
    //
    const { cubeService } = this.injected;
    const { cube } = cubeService;
    const { onChangeCubeProps, readonly } = this.props;

    return (
      <CubeExposureInfoView
        cube={cube}
        onChangeCubeProps={onChangeCubeProps}
        readonly={readonly}
      />
    );
  }
}

export default CubeExposureInfoContainer;
