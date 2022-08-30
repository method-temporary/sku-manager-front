import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import CreateIntroView from '../view/CreateIntroView';
import { ContentsProviderService } from '../../../../college';
import CubeService from '../../present/logic/CubeService';

interface Props extends RouteComponentProps {
  cubeId?: string;
  cubeType?: string;
  filesMap: Map<string, any>;
  readonly?: boolean;
}

interface Injected {
  cubeService: CubeService;
  contentsProviderService: ContentsProviderService;
}

@inject('cubeService', 'contentsProviderService')
@observer
@reactAutobind
class CreateIntroContainer extends ReactComponent<Props, {}, Injected> {
  //
  componentDidMount() {
    //
    const { contentsProviderService } = this.injected;
    if (contentsProviderService) {
      this.findAllContentsProviders();
    }
  }

  async findAllContentsProviders() {
    //
    const { contentsProviderService } = this.injected;
    await contentsProviderService.findAllContentsProviders();
  }

  getContentsProvider(id: string): string {
    const { contentsProviders } = this.injected.contentsProviderService;
    let name = id;
    contentsProviders.forEach((contentsProvider) => {
      if (contentsProvider.id === id) {
        name = getPolyglotToAnyString(contentsProvider.name);
      }
    });
    return name;
  }

  onChangeCubeProps(name: string, value: string | number | {}) {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeProps(name, value);
  }

  setHourAndMinute(name: string, value: number) {
    //
    if (value < 0) value = 0;
    const { cubeService } = this.injected;
    const learningTime = cubeService.cube.learningTime;

    let hours: number = parseInt(String(learningTime / 60), 10);
    let minutes: number = parseInt(String(learningTime % 60), 10);
    Promise.resolve()
      .then(() => {
        if (name === 'hour') {
          if (value >= 1000) value = 999;
          hours = value;
        }
        if (name === 'minute') {
          if (value >= 60) value = 59;
          minutes = value;
        }
      })
      .then(() => this.setLearningTime(hours, minutes));
  }

  setLearningTime(hour: number, minute: number) {
    //
    const { cubeService } = this.injected;

    const numberHour = Number(hour);
    const numberMinute = Number(minute);
    const newMinute = numberHour * 60 + numberMinute;
    cubeService.changeCubeProps('learningTime', newMinute);
  }

  onSelectInstructor(index: number, name: string, value: boolean): void {
    const { cubeService } = this.injected;
    cubeService.cubeInstructors.forEach((cubeInstructor, index) => {
      if (cubeInstructor.representative) {
        cubeService.changeTargetCubeInstructorProp(index, 'representative', false);
      }
    });

    cubeService.changeTargetCubeInstructorProp(index, name, value);
  }

  onDeleteInstructor(index: number): void {
    const { cubeService } = this.injected;
    cubeService.deleteTargetCubeInstructor(index);
  }

  onChangeTargetInstructor(index: number, name: string, value: any): void {
    const { cubeService } = this.injected;
    cubeService.changeTargetCubeInstructorProp(index, name, value);
  }

  render() {
    //
    const { cubeService } = this.injected;
    const { cube, cubeInstructors } = cubeService;
    const { filesMap, readonly } = this.props;

    return (
      <CreateIntroView
        changeCubeProps={this.onChangeCubeProps}
        setHourAndMinute={this.setHourAndMinute}
        onChangeTargetInstructor={this.onChangeTargetInstructor}
        onSelectInstructor={this.onSelectInstructor}
        onDeleteInstructor={this.onDeleteInstructor}
        getContentsProvider={this.getContentsProvider}
        cube={cube}
        filesMap={filesMap}
        cubeInstructors={cubeInstructors}
        readonly={readonly}
      />
    );
  }
  // }
}

export default withRouter(CreateIntroContainer);
