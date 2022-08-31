import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel, SortFilterState } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, Modal, Pagination, SearchBox } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CubeQueryModel } from '../../model/CubeQueryModel';
import { CubeWithReactiveModel } from '../../model/sdo/CubeWithReactiveModel';
import CardCubeListModalView from '../../../../card/card/ui/view/CardCubeListModalView';
import { CubeService } from '../../index';
import { CardService } from '../../../../card';
import { CollegeService, ContentsProviderService } from '../../../../college';
import { UserWorkspaceService } from '../../../../userworkspace';

interface Props {
  onClickOk: (cubeId: string) => void;
}

interface States {
  selectedCubeId: string;
}

interface Injected {
  cubeService: CubeService;
  cardService: CardService;
  collegeService: CollegeService;
  sharedService: SharedService;
  contentsProviderService: ContentsProviderService;
  userWorkspaceService: UserWorkspaceService;
  searchBoxService: SearchBoxService;
}

@inject(
  'collegeService',
  'searchBoxService',
  'cubeService',
  'contentsProviderService',
  'userWorkspaceService',
  'sharedService',
  'cardService'
)
@observer
@reactAutobind
class CubeListIgnoreAccessiblityModal extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'cubeModal';
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCubeId: '',
    };
  }

  async onChangeCollege(id: string) {
    //
    const { collegeService, searchBoxService } = this.injected;
    const { changePropsFn } = searchBoxService;
    const { findMainCollege } = collegeService;

    if (id === '') {
      changePropsFn('channelId', '');
    } else {
      await findMainCollege(id);
    }
  }

  async findAllCubes() {
    //
    const { cubeService, sharedService } = this.injected;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    sharedService.setSortFilter(this.paginationKey, SortFilterState.TimeDesc);

    cubeService.changeCubeQueryProps('forSelection', true);

    const offsetElementList = await cubeService.findCubesIgnoringAccessibilityByQdo(
      CubeQueryModel.asCubeAdminRdo(cubeService.cubeQuery, pageModel)
    );

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onChangeCubeQueryProps(name: string, value: any): void {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeQueryProps(name, value);
  }

  clearCubeQuery(): void {
    //
    const { cubeService } = this.injected;
    cubeService.clearCubeQuery();
  }

  selectChannels() {
    //
    const { mainCollege } = this.injected.collegeService;
    const select: SelectTypeModel[] = [new SelectTypeModel()];

    mainCollege.channels.map((channel) =>
      select.push(new SelectTypeModel(channel.id, getPolyglotToAnyString(channel.name), channel.id))
    );

    return select;
  }

  async onMount() {
    //
  }

  onClickOk(close: () => void) {
    //
    const { onClickOk } = this.props;
    const { selectedCubeId } = this.state;

    if (selectedCubeId === null || selectedCubeId === '') {
      alert(AlertModel.getCustomAlert(true, 'Cube 불러오기 안내', 'Cube를 선택해주세요', '확인', () => {}));
    } else {
      this.clearSelected();
      close();
      onClickOk(selectedCubeId);
    }
  }

  onClickCheck(cubeWiths: CubeWithReactiveModel, index: number) {
    //
    const { selectedCubeId } = this.state;

    if (selectedCubeId === cubeWiths.cubeId) {
      this.setState({ selectedCubeId: '' });
    } else {
      this.setState({ selectedCubeId: cubeWiths.cubeId });
    }
  }

  removeInList(index: number, oldList: any[]) {
    //
    if (oldList.length === 1) return [];

    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  clearSelected() {
    //
    const { clearSelectedCubes, clearSelectedIds } = this.injected.cubeService;

    clearSelectedCubes();
    clearSelectedIds();
  }

  onSelectSharedOnly(value: boolean) {
    //
    const { searchBoxService } = this.injected;
    const { changePropsFn } = searchBoxService;

    if (value) {
      changePropsFn('collegeId', '');
      changePropsFn('channelId', '');
    }
  }

  getUserWorkspacesSelect(): SelectTypeModel[] {
    //
    const { userWorkspaceService } = this.injected;
    const { allUserWorkspaces } = userWorkspaceService;
    const userWorkspaceSelect: SelectTypeModel[] = [new SelectTypeModel('', '전체', '')];

    allUserWorkspaces.forEach((userWorkspace) => {
      userWorkspaceSelect.push(
        new SelectTypeModel(userWorkspace.id, getPolyglotToAnyString(userWorkspace.name), userWorkspace.id)
      );
    });

    return userWorkspaceSelect;
  }

  render() {
    //
    const { selectedCubeId } = this.state;
    const { collegeService, searchBoxService, cubeService } = this.injected;
    const { collegesMap, channelMap } = collegeService;

    const { cubeQuery, cubeWithReactiveModels, changeCubeQueryProps } = cubeService;
    const userWorkspaceSelect = this.getUserWorkspacesSelect();

    return (
      <Modal
        size="large"
        trigger={
          <Button type="button" onClick={this.onMount}>
            Cube 1
          </Button>
        }
      >
        <Modal.Header className="res">Cube 정보 불러오기</Modal.Header>
        <Modal.Content className="fit-layout" scrolling>
          <SearchBox
            onSearch={this.findAllCubes}
            queryModel={cubeQuery}
            changeProps={changeCubeQueryProps}
            name={this.paginationKey}
            modal
          >
            <SearchBox.Group name="등록일자">
              <SearchBox.DatePicker
                startFieldName="period.startDateMoment"
                endFieldName="period.endDateMoment"
                searchButtons
              />
            </SearchBox.Group>
            <SearchBox.Group name="소속사">
              <SearchBox.Select fieldName="cineroomId" options={userWorkspaceSelect} placeholder="전체" />
            </SearchBox.Group>

            <SearchBox.Query
              options={SelectType.searchPartForCube}
              placeholders={['전체', '검색어를 입력하세요.']}
              searchWordDisabledKey="searchPart"
              searchWordDisabledValues={['', '전체']}
            />
          </SearchBox>

          <CardCubeListModalView
            cubes={cubeWithReactiveModels}
            selectedIds={[selectedCubeId]}
            onClickCheck={this.onClickCheck}
            collegesMap={collegesMap}
            channelMap={channelMap}
          />

          <Pagination name={this.paginationKey} onChange={this.findAllCubes}>
            <Pagination.Navigator />
          </Pagination>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 d">CANCEL</Modal.CloseButton>
          <Modal.CloseButton onClickWithClose={(event, close) => this.onClickOk(close)} className="w190 p">
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CubeListIgnoreAccessiblityModal;
