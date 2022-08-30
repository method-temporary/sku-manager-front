import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import CubeService from 'cube/cube/present/logic/CubeService';
import CubeDescriptionView from '../view/CubeDescriptionView';


interface Props extends RouteComponentProps<Params> {
  readonly?: boolean;
}

interface States {}

interface Params {}

interface Injected {
  cubeService: CubeService;
}

@inject('cubeService')
@observer
@reactAutobind
class CubeDescriptionContainer extends ReactComponent<Props, States, Injected> {

  componentDidMount() {}

  onChangeCubeDescriptionProps(name: string, value: any): void {
    const { cubeService } = this.injected;
    cubeService.changeCubeProps(name, value);
  }

  onTextareaChange(name: string, value: any): void {
    const { cubeService } = this.injected;
    const invalid = value.length > 1000;

    if (invalid) {
      return;
    }

    cubeService.changeCubeProps(name, value);
  }

  render() {
    const { cubeService } = this.injected;
    const { cube } = cubeService;
    const { readonly } = this.props;

    return (
      <CubeDescriptionView
        onChangeCubeDescriptionProps={this.onChangeCubeDescriptionProps}
        onTextareaChange={this.onTextareaChange}
        cube={cube}
        readonly={readonly}
      />
    );
  }
}

export default withRouter(CubeDescriptionContainer);
