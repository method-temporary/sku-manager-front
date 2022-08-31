import React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { SearchBox } from 'shared/components';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { CubeQueryModel } from '../../model/CubeQueryModel';

interface Props {
  findAllCubes: () => void;
  onChangeCubeQueryProps: (name: string, value: any) => void;
  clearCubeQuery: () => void;
  selectChannel: () => SelectTypeModel[];
  onChangeCollege: (value: string) => void;
  onSelectSharedOnly: (value: boolean) => void;
  cubeQuery: CubeQueryModel;
  contentsProviders: [];
  paginationKey: string;
  collegesSelect: SelectTypeModel[];
  searchBoxQueryModel: any;
}

@observer
@reactAutobind
class CubeSearchBoxView extends ReactComponent<Props, {}> {
  //
  componentDidMount() {}

  render() {
    //
    const { findAllCubes, onChangeCubeQueryProps, selectChannel, onChangeCollege, onSelectSharedOnly } = this.props;
    const { cubeQuery, contentsProviders, paginationKey, collegesSelect, searchBoxQueryModel } = this.props;
    const collegeSelectTypes = addSelectTypeBoxAllOption(collegesSelect);
    const channelSelectTypes = selectChannel();
    const collegeDisableKey = 'sharedOnly';
    const channelDisableKey = 'collegeId';
    return (
      <>
        <SearchBox
          onSearch={findAllCubes}
          changeProps={onChangeCubeQueryProps}
          queryModel={cubeQuery}
          name={paginationKey}
        >
          <SearchBox.Group name="등록일자">
            <SearchBox.CubeDatePicker startFieldName="period.startDateMoment" endFieldName="period.endDateMoment" />
          </SearchBox.Group>
          <SearchBox.Group name="공개범위">
            <SearchBox.Select
              disabled={searchBoxQueryModel[collegeDisableKey]}
              fieldName="collegeId"
              options={collegeSelectTypes}
              placeholder="공개범위"
              onChange={(event, data) => onChangeCollege(data.value)}
            />

            <SearchBox.Select
              name="교육형태"
              fieldName="cubeType"
              options={SelectType.learningTypeForEnum3}
              placeholder="전체"
            />
          </SearchBox.Group>

          <SearchBox.Group name="검색">
            <SearchBox.Select fieldName="searchPart" options={SelectType.searchPartForCubeNotAll} />
            <SearchBox.Input fieldName="searchWord" placeholder="검색어를 입력하세요." />
          </SearchBox.Group>
          {/*<SearchBox.BasicSearch*/}
          {/*  options={SelectType.searchPartForCubeNotAll}*/}
          {/*  searchWordDisabledKey="searchPart"*/}
          {/*  searchWordDisabledValues={['과정명', '과정명']}*/}
          {/*/>*/}
        </SearchBox>
      </>
    );
  }
}

export default CubeSearchBoxView;
