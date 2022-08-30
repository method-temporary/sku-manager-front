import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';

import SearchTag from '../../../board/searchTag/model/SearchTag';
import { CubeModel } from '../..';
import ConceptModal from '../../../../board/tag/ui/view/ConceptModal';
import ConceptView from '../../../../board/tag/model/view/ConceptView';
import UserWorkspaceModel from '../../../../userworkspace/model/UserWorkspaceModel';
import PermittedCineroomModal from '../../../../card/shared/components/permittedCineroomModal/PermittedCineroomModal';
import { useFindAllUserWorkSpaces } from '../../../../userworkspace/userWorkSpace.hook';
import { PermittedCineroom } from '../../../../_data/lecture/cards/model/vo';
import PermittedCineroomList from '../../../../card/shared/components/permittedCineroomModal/components/PermittedCineroomList';

interface Props {
  onChangeCubeProps: (name: string, value: string | [] | {}) => void;
  addSharedCineroomId: (cineroomId: string) => void;
  addAllSharedCineroomId: (checked: boolean) => void;
  onHandleTermModalOk: (selectedConcept: ConceptView[]) => void;

  cube: CubeModel;
  userWorkspaces: UserWorkspaceModel[];
  searchTags?: SearchTag[];
  readonly?: boolean;
}

@observer
@reactAutobind
class CubeExposureInfoView extends ReactComponent<Props, {}> {
  //
  // getSubsidiaryName(id: string): string {
  //   //
  //   let targetName = '';
  //   if (this.props.userWorkspaces.some((target) => target.id === id)) {
  //     targetName = getPolyglotToAnyString(this.props.userWorkspaces.find((target) => target.id === id)!.name);
  //   }
  //   return targetName;
  // }

  onClickOk(permittedCinerooms: PermittedCineroom[]) {
    //
    const { onChangeCubeProps } = this.props;

    onChangeCubeProps(
      'sharingCineroomIds',
      permittedCinerooms.map((cineroom) => cineroom.cineroomId)
    );
  }

  getWorkspaceData() {}

  render() {
    //
    const {
      cube,
      onChangeCubeProps,
      addSharedCineroomId,
      addAllSharedCineroomId,
      onHandleTermModalOk,
      userWorkspaces,
      readonly,
    } = this.props;
    const checked = userWorkspaces.length === cube.sharingCineroomIds.length;

    const permittedCinerooms = cube.sharingCineroomIds.map((id) => ({ cineroomId: id, required: false }));

    return (
      <FormTable title="노출 정보">
        <FormTable.Row name="활용 범위">
          <PermittedCineroomModal
            title="활용 범위 설정하기"
            contentsHeader="멤버사 적용 범위 설정"
            permittedCinerooms={permittedCinerooms}
            onOk={this.onClickOk}
            readonly={readonly}
          />
          {permittedCinerooms.length > 0 && <PermittedCineroomList permittedCinerooms={permittedCinerooms} />}
        </FormTable.Row>
        <FormTable.Row name="Tag 정보">
          <Polyglot.Input
            languageStrings={cube.cubeContents.tags}
            name="cubeContents.tags"
            onChangeProps={onChangeCubeProps}
            placeholder='Tag 와 Tag는 쉼표(",")로 구분하며, 최대 10개까지 입력하실 수 있습니다.'
            readOnly={readonly}
          />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CubeExposureInfoView;
