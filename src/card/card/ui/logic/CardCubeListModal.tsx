import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import { Button } from 'semantic-ui-react';

import { SelectType, SelectTypeModel, SortFilterState, PatronKey } from 'shared/model';
import { SharedService } from 'shared/present';
import { Modal, Pagination, SearchBox } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { CollegeService, ContentsProviderService } from '../../../../college';
import { CubeQueryModel, CubeService, CubeWithReactiveModel } from 'cube/cube';

import CardCubeListModalView from '../view/CardCubeListModalView';
import { LearningContentType } from '../../model/vo/LearningContentType';
import { CardService } from '../../index';

interface Props {
  title?: string;
  onClickOk: (cubes: CubeWithReactiveModel[], cubeIds: string[]) => boolean;
  disabled?: boolean;
  selectedContentIds?: string[];
  onClickCube?: (cube: CubeWithReactiveModel) => void;
}

interface Injected {
  cubeService: CubeService;
  cardService: CardService;
  collegeService: CollegeService;
  sharedService: SharedService;
  contentsProviderService: ContentsProviderService;
  searchBoxService: SearchBoxService;
}

@inject('collegeService', 'searchBoxService', 'cubeService', 'contentsProviderService', 'sharedService', 'cardService')
@observer
@reactAutobind
class CardCubeListModal extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'cubeModal';

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

    const offsetElementList = await cubeService.findCubeWithReactiveModelsForAdmin(
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

  setContentsProvider() {
    const selectContentsProviderType: any = [];
    const { contentsProviders } = this.injected.contentsProviderService;
    selectContentsProviderType.push({
      key: '0',
      text: '전체',
      value: '전체',
    });
    contentsProviders.forEach((contentsProvider, index) => {
      selectContentsProviderType.push({
        key: contentsProvider.id,
        text: getPolyglotToAnyString(contentsProvider.name),
        value: contentsProvider.id,
      });
    });
    return selectContentsProviderType;
  }

  async onMount() {
    //
    const { cardContentsQuery } = this.injected.cardService;
    const { setSelectedIds, setSelectedCubes } = this.injected.cubeService;

    const ids: string[] = [];
    const cubes: CubeWithReactiveModel[] = [];
    cardContentsQuery.learningContents &&
      cardContentsQuery.learningContents.forEach((content) => {
        if (content.learningContentType === LearningContentType.Chapter) {
          content.children &&
            content.children.forEach((cContent) => {
              if (cContent.learningContentType === LearningContentType.Cube) {
                ids.push(cContent.contentId);
                cubes.push(
                  // new CubeWithReactiveModel({
                  //   cube: new CubeModel({
                  //     id: cContent.contentId,
                  //     name: cContent.name,
                  //     type: cContent.contentDetailType,
                  //   } as CubeModel),
                  //   cubeContents: new CubeContentsModel({
                  //     registrantName: cContent.registrantName,
                  //   } as CubeContentsModel),
                  //   cubeReactiveModel: new CubeReactiveModelModel(),
                  // })
                  new CubeWithReactiveModel({
                    cubeId: cContent.contentId,
                    name: cContent.name,
                    type: cContent.contentDetailType,
                    registrantName: cContent.registrantName,
                  } as CubeWithReactiveModel)
                );
              }
            });
        } else if (content.learningContentType === LearningContentType.Cube) {
          ids.push(content.contentId);
        }
      });

    setSelectedIds(ids);
    setSelectedCubes(cubes);
  }

  onClickOk(close: () => void) {
    //
    const { onClickOk } = this.props;
    const { selectedCubes, selectedIds } = this.injected.cubeService;

    if (onClickOk(selectedCubes, selectedIds)) {
      this.clearSelected();
      close();
    }
  }

  onClickCheck(cubeWiths: CubeWithReactiveModel, index: number) {
    //
    const { onClickCube } = this.props;
    if (onClickCube) {
      onClickCube(cubeWiths);
    }

    const { selectedIds, removeSelectedCubes, removeSelectedIds, addSelectedCubes, addSelectedIds } =
      this.injected.cubeService;

    // if (selectedIds.includes(cubeWiths.cube.id)) {
    //   removeSelectedCubes(cubeWiths.cube.id);
    //   removeSelectedIds(cubeWiths.cube.id);
    // } else {
    //   addSelectedCubes(cubeWiths);
    //   addSelectedIds(cubeWiths.cube.id);
    // }
    if (selectedIds.includes(cubeWiths.cubeId)) {
      removeSelectedCubes(cubeWiths.cubeId);
      removeSelectedIds(cubeWiths.cubeId);
    } else {
      addSelectedCubes(cubeWiths);
      addSelectedIds(cubeWiths.cubeId);
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

  getCollegeSelect(): SelectTypeModel[] {
    //
    const { collegeService } = this.injected;
    const { colleges } = collegeService;
    const cineroom = patronInfo.getCineroom();
    const collegeSelect: SelectTypeModel[] = [];

    colleges
      .filter((college) => PatronKey.getCineroomId(college.patronKey) === cineroom?.id)
      .forEach((college) => {
        collegeSelect.push(new SelectTypeModel(college.id, getPolyglotToAnyString(college.name), college.id));
      });
    return collegeSelect;
  }

  render() {
    //
    const { collegeService, searchBoxService, cubeService } = this.injected;
    const { collegesMap, channelMap } = collegeService;
    const { searchBoxQueryModel } = searchBoxService;
    const channelDisableKey = 'collegeId';
    const collegeDisableKey = 'sharedOnly';

    const { selectedContentIds } = this.props;
    const { cubeQuery, cubeWithReactiveModels, selectedIds, changeCubeQueryProps } = cubeService;
    const contentsProviders = this.setContentsProvider();
    const collegesSelect = this.getCollegeSelect();

    const { disabled } = this.props;

    return disabled ? (
      <Button type="button" disabled={disabled}>
        Cube 선택
      </Button>
    ) : (
      <Modal
        size="large"
        trigger={
          <Button type="button" disabled={disabled} onClick={() => this.onMount()}>
            Cube 선택
          </Button>
        }
      >
        <Modal.Header className="res">Cube 선택</Modal.Header>
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

            <SearchBox.Group name="College / Channel">
              <SearchBox.Select
                disabled={searchBoxQueryModel[collegeDisableKey]}
                options={addSelectTypeBoxAllOption(collegesSelect)}
                fieldName="collegeId"
                placeholder="전체"
                onChange={(event, data) => this.onChangeCollege(data.value)}
              />
              <SearchBox.Select
                disabled={
                  searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '전체'
                }
                options={this.selectChannels()}
                fieldName="channelId"
                placeholder="전체"
              />
            </SearchBox.Group>

            <SearchBox.Group>
              <SearchBox.Select
                name="교육형태"
                fieldName="cubeType"
                options={SelectType.learningTypeForSearch}
                placeholder="전체"
              />
              <SearchBox.Select
                name="교육기관"
                fieldName="organizerId"
                options={contentsProviders}
                placeholder="전체"
              />
              <SearchBox.Group name="공유된 Cube만 보기">
                <SearchBox.CheckBox
                  fieldName="sharedOnly"
                  onChange={(event, data) => this.onSelectSharedOnly(data.checked)}
                />
              </SearchBox.Group>
              {/*<SearchBox.Select name="사용여부" fieldName="enabled" options={SelectType.openType} placeholder="전체" />*/}
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
            selectedIds={(selectedContentIds && selectedContentIds.length > -1 && selectedContentIds) || selectedIds}
            onClickCheck={this.onClickCheck}
            collegesMap={collegesMap}
            channelMap={channelMap}
          />

          <Pagination name={this.paginationKey} onChange={this.findAllCubes}>
            <Pagination.Navigator />
          </Pagination>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton onClickWithClose={(event, close) => this.onClickOk(close)} className="w190 p">
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CardCubeListModal;
