import * as React from 'react';
import { inject, observer } from 'mobx-react';
import CubeService from '../../present/logic/CubeService';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import CubeExposureInfoView from '../view/CubeExposureInfoView';
import ConceptView from 'board/tag/model/view/ConceptView';
import { UserWorkspaceService } from '../../../../userworkspace';

interface Props {
  onChangeCubeProps: (name: string, value: string | {} | []) => void;
  addSharedCineroomId: (cineroomId: string) => void;
  addAllSharedCineroomId: (checked: boolean) => void;
  readonly?: boolean;
}

interface Injected {
  cubeService: CubeService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('cubeService', 'userWorkspaceService')
@observer
@reactAutobind
class CubeExposureInfoContainer extends ReactComponent<Props, {}, Injected> {
  //
  componentDidMount() {}

  onHandleTermModalOk(selectedConcept: ConceptView[]) {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeProps('cubeContents.terms', selectedConcept);
  }

  render() {
    //
    const { cubeService, userWorkspaceService } = this.injected;
    const { cube } = cubeService;
    const { allUserWorkspaces } = userWorkspaceService;
    const { onChangeCubeProps, addSharedCineroomId, addAllSharedCineroomId, readonly } = this.props;

    return (
      <CubeExposureInfoView
        cube={cube}
        onChangeCubeProps={onChangeCubeProps}
        addSharedCineroomId={addSharedCineroomId}
        addAllSharedCineroomId={addAllSharedCineroomId}
        onHandleTermModalOk={this.onHandleTermModalOk}
        userWorkspaces={allUserWorkspaces}
        readonly={readonly}
      />
    );
  }
}

export default CubeExposureInfoContainer;
