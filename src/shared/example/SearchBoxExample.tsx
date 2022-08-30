import React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Container, DropdownProps, Header, InputProps } from 'semantic-ui-react';
import moment from 'moment';
import ko from 'date-fns/locale/ko';

import { SearchBox } from '../components';
import SelectTypeModel from '../model/SelectTypeModel';

import SearchBoxExampleService from './logic/SearchBoxExampleService';
import { SelectType } from '../model';

interface Props {}

interface State {
  startDate: Date;
  endDate: Date;
  sampleOptions: SelectTypeModel[];
  select: string;
  value: string;
  disableValue: string;
}

interface Injected {
  searchBoxExampleService: SearchBoxExampleService;
}

@inject('searchBoxExampleService')
@observer
@reactAutobind
class SearchBoxExample extends ReactComponent<Props, State, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      startDate: moment().toDate(),
      endDate: moment().toDate(),
      sampleOptions: [
        { key: '0', text: '전체', value: '' },
        { key: '1', text: '서울', value: 'S' },
        { key: '2', text: '경기', value: 'G' },
        { key: '3', text: '대전', value: 'D' },
      ],
      select: '',
      value: '',
      disableValue: '',
    };
  }

  onChangeInput(event: React.SyntheticEvent<HTMLInputElement>, { value }: InputProps) {
    //
    this.setState({ value: value as string });
  }

  onChangeSelect(event: React.SyntheticEvent<HTMLSelectElement>, { value }: DropdownProps) {
    //
    this.setState({ select: value as string });
  }

  onClickFieldButton() {
    //
    this.setState({ disableValue: 'Select' });
  }

  onClickFieldCancelButton() {
    //
    this.setState({ disableValue: '' });
  }

  onClickSearch() {
    //
    console.log(this.state);
  }

  render() {
    //
    const { sampleOptions } = this.state;

    return (
      <Container fluid>
        <Header size="small">DatePicker</Header>

        <SearchBox
          onSearch={this.onClickSearch}
          changeProps={this.injected.searchBoxExampleService.changeSearchBoxExampleQueryModelProp}
          queryModel={this.injected.searchBoxExampleService.searchBoxExampleQueryModel}
          name="example"
        >
          <SearchBox.Group name="단일 DatePicker">
            <SearchBox.DatePicker
              ago="m"
              locale={ko}
              showFormat="m"
              dateFormat="yyyy-MM"
              startFieldName="singleStartDate"
            />
          </SearchBox.Group>

          <SearchBox.Group name="등록일자">
            <SearchBox.DatePicker startFieldName="startDate" endFieldName="endDate" searchButtons />
          </SearchBox.Group>

          <SearchBox.Group name="User">
            <SearchBox.Select fieldName="singleSelect" options={sampleOptions} placeholder="All" />
          </SearchBox.Group>

          <SearchBox.Group name="복수 Select">
            <SearchBox.Select fieldName="multiSelectFirst" options={sampleOptions} placeholder="All" />
            <SearchBox.Select fieldName="multiSelectSecond" options={sampleOptions} placeholder="All" />
          </SearchBox.Group>

          <SearchBox.Group>
            <SearchBox.Select name="First Select" fieldName="firstSelect" options={sampleOptions} placeholder="All" />
            <SearchBox.Select name="Second Select" fieldName="secondSelect" options={sampleOptions} placeholder="All" />
          </SearchBox.Group>

          <SearchBox.Group name="단일 input">
            <SearchBox.Input fieldName="singleInput" />
          </SearchBox.Group>

          <SearchBox.Group name="Select Input">
            <SearchBox.Select
              fieldName="selectInputSelect"
              options={SelectType.searchUserGroupMember}
              placeholder="All"
            />
            <SearchBox.Input fieldName="selectInputInput" />
          </SearchBox.Group>

          <SearchBox.Group name="복합 Input">
            <SearchBox.FieldButton onClick={this.onClickFieldButton}>Select</SearchBox.FieldButton>
            <SearchBox.Input width={11} disabled fieldName="input" />
            <SearchBox.FieldButton onClick={this.onClickFieldCancelButton}>선택 취소</SearchBox.FieldButton>
          </SearchBox.Group>
        </SearchBox>
      </Container>
    );
  }
}

export default SearchBoxExample;
