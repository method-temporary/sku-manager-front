import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { ContentsProviderService } from '../../../../college';
import { MediaService } from '../../index';
import { CubeService } from '../../../cube';
import ContentsProviderSelectForCubeIntroView from '../view/ContentsProviderSelectForCubeIntroView';
import ContentsProviderSelectForMediaView from '../view/ContentsProviderSelectForMediaView';
import { ContentsProviderModel } from '../../../../college/model/ContentsProviderModel';

interface Props {
  defaultValue?: string;
  targetProps?: string;
  type: string;
  onChangedNoti?: (name: string, value: string) => void;
  readonly?: boolean;
}

interface States {}

interface Injected {
  cubeService: CubeService;
  contentsProviderService: ContentsProviderService;
  mediaService: MediaService;
}

@inject('cubeService', 'contentsProviderService', 'mediaService')
@observer
@reactAutobind
class ContentsProviderSelectContainer extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {
    //
    const { contentsProviderService } = this.injected;
    if (contentsProviderService) {
      this.findAllContentsProviders();
    }
  }

  onSetCubeIntroPropsByJSON(name: string, value: string) {
    //
    const { cubeService } = this.injected;
    const { onChangedNoti } = this.props;
    // const newValue = JSON.parse(value);
    cubeService.changeCubeProps(name, value);
    if (onChangedNoti) onChangedNoti(name, value);
  }

  onChangeCubeIntroProps(name: string, value: string) {
    //
    const { cubeService } = this.injected;
    const { onChangedNoti } = this.props;
    cubeService.changeCubeProps(name, value);
    if (onChangedNoti) onChangedNoti(name, value);
  }

  onSetMediaPropsByJSON(name: string, value: string) {
    //
    const { mediaService } = this.injected;
    const { onChangedNoti } = this.props;
    // const newValue = JSON.parse(value);
    if (mediaService) mediaService.changeMediaProps(name, value);
    if (onChangedNoti) onChangedNoti(name, value);
  }

  findAllContentsProviders() {
    //
    const { contentsProviderService } = this.injected;
    if (contentsProviderService) contentsProviderService.findAllContentsProviders();
  }

  setContentsProvider() {
    const selectContentsProviderType: any = [];
    const { contentsProviders } = this.injected.contentsProviderService;
    contentsProviders.forEach((contentsProvider) => {
      selectContentsProviderType.push({
        key: contentsProvider.id,
        text: getPolyglotToAnyString(contentsProvider.name),
        value: contentsProvider.id,
      });
    });
    return selectContentsProviderType;
  }

  onChangeMediaProps(name: string, value: string) {
    //
    const { mediaService } = this.injected;
    if (mediaService) mediaService.changeMediaProps(name, value);
  }

  getContentsProvider(): ContentsProviderModel | undefined {
    const { contentsProviders } = this.injected.contentsProviderService;
    return contentsProviders.find((target) => target.id === this.props.defaultValue);
  }

  renderForCubeIntro() {
    //
    const { defaultValue, targetProps, readonly } = this.props;
    const { cube } = this.injected.cubeService;
    const otherOrganizerName = cube.cubeContents.otherOrganizerName;
    const organizerId = cube.cubeContents.organizerId;

    return (
      <ContentsProviderSelectForCubeIntroView
        defaultValue={defaultValue}
        targetProps={targetProps}
        onSetCubeIntroPropsByJSON={this.onSetCubeIntroPropsByJSON}
        setContentsProvider={this.setContentsProvider}
        getContentsProvider={this.getContentsProvider}
        onChangeCubeIntroProps={this.onChangeCubeIntroProps}
        organizerId={organizerId}
        otherOrganizerName={otherOrganizerName}
        readonly={readonly}
      />
    );
  }

  renderForMedia() {
    //
    const { defaultValue, targetProps, readonly } = this.props;
    return (
      <ContentsProviderSelectForMediaView
        defaultValue={defaultValue}
        targetProps={targetProps}
        onSetMediaPropsByJSON={this.onSetMediaPropsByJSON}
        setContentsProvider={this.setContentsProvider}
        readonly={readonly}
      />
    );
  }

  render() {
    const { type } = this.props;

    if (type === 'media') return this.renderForMedia();
    else return this.renderForCubeIntro();
  }
}

export default ContentsProviderSelectContainer;
