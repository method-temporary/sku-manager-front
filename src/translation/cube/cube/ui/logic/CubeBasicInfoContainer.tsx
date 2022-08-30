import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import CubeService from 'cube/cube/present/logic/CubeService';
import CubeBasicInfoView from '../view/CubeBasicInfoView';

interface Props {
  readonly?: boolean;
  cubeId: string;
}

interface States {}

interface Injected {
  cubeService: CubeService;
}

@inject('cubeService' )
@observer
@reactAutobind
class CubeBasicInfoContainer extends ReactComponent<Props, States, Injected> {
  
  onChangeCubeProps(name: string, value: any) {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeProps(name, value);
  }

  render() {
    //
    const { cubeService } = this.injected;
    const { cube } = cubeService;
    const { readonly } = this.props;

    return (
      <CubeBasicInfoView
        onChangeCubeProps={this.onChangeCubeProps}
        cube={cube}
        readonly={readonly}
      />
    );
  }
}

export default CubeBasicInfoContainer;
