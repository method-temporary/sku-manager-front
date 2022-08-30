import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Container } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, confirm, ConfirmModel, Loader, PageTitle, Pagination, SubActions } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import OperatorService from '../../present/logic/OperatorService';
import OperatorQueryModel from '../../model/OperatorQueryModel';
import QuestOperatorSearchBox from '../view/QuestOperatorSearchBox';
import QuestOperatorListView from '../view/QuestOperatorListView';
import QuestionOperatorCreateModal from './QuestionOperatorCreateModal';

interface Params {}

interface Props extends RouteComponentProps<Params> {}

interface State {}

interface Injected {
  operatorService: OperatorService;
  sharedService: SharedService;
  searchBoxService: SearchBoxService;
}

@inject('operatorService', 'sharedService', 'searchBoxService')
@observer
@reactAutobind
class QuestionOperatorListContainer extends ReactComponent<Props, State, Injected> {
  //
  paginationKey = 'qna-operator';

  componentDidMount() {
    //
    const { operatorService } = this.injected;
    operatorService.findAllOperatorGroup();
  }

  async findByRdo(): Promise<void> {
    //
    const { operatorService, sharedService } = this.injected;
    const { operatorQuery } = operatorService;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    const offsetElementList = await operatorService.findByRdo(OperatorQueryModel.asRdo(operatorQuery, pageModel));

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onChangeOperatorQueryProps(name: string, value: any): void {
    //
    const { operatorService } = this.injected;
    operatorService.changeOperatorQueryProps(name, value);
  }

  setSelectOptions(): SelectTypeModel[] {
    //
    const { operatorService } = this.injected;
    const { operatorGroups } = operatorService;
    const options: SelectTypeModel[] = [];

    options.push(new SelectTypeModel('0', '전체', ''));
    operatorGroups.forEach((operatorGroup, index) => {
      options.push(new SelectTypeModel(`${index + 1}`, getPolyglotToAnyString(operatorGroup.name), operatorGroup.id));
    });

    return options;
  }

  getOperatorGroupName(id: string): string {
    const { operatorService } = this.injected;
    const { operatorGroups } = operatorService;
    const groupName = operatorGroups.find((group) => group.id === id)?.name;

    return (groupName && getPolyglotToAnyString(groupName)) || '-';
  }

  onClickOperatorCheckBox(id: string): void {
    //
    const { operatorService } = this.injected;
    const { selectedOperatorIds } = operatorService;
    const selectedIds = [...selectedOperatorIds];

    if (selectedIds.some((target) => target === id)) {
      selectedIds.splice(
        selectedIds.findIndex((target) => target === id),
        1
      );
    } else {
      selectedIds.push(id);
    }

    operatorService.setSelectedOperatorIds(selectedIds);
  }

  onClickAllCheckBox(value: boolean): void {
    //
    const { operatorService } = this.injected;
    const { operators } = operatorService;

    if (value) {
      operatorService.setSelectedOperatorIds(operators.map((owi) => owi.operator.id));
    } else {
      operatorService.setSelectedOperatorIds([]);
    }
  }

  async onRemoveOperators(): Promise<void> {
    //
    const { operatorService } = this.injected;
    const { selectedOperatorIds } = operatorService;

    if (selectedOperatorIds.length > 0) {
      confirm(
        ConfirmModel.getCustomConfirm(
          '문의 담당자 삭제',
          '선택한 문의담당자를 삭제 하시겠습니까?',
          true,
          '확인',
          '취소',
          async () => {
            await operatorService.removeOperators(selectedOperatorIds);
            await this.findByRdo();
          }
        )
      );
    } else {
      alert(AlertModel.getCustomAlert(true, '문의 담당자 삭제', '삭제할 문의 담당자를 선택해주세요', '확인', () => {}));
    }
  }

  render() {
    //
    const { operatorService, sharedService, searchBoxService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { searchBoxQueryModel } = searchBoxService;
    const { operators, operatorQuery, selectedOperatorIds } = operatorService;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.qnaOperator} />
        <Pagination name={this.paginationKey} onChange={this.findByRdo}>
          <QuestOperatorSearchBox
            onSearch={this.findByRdo}
            onChangeProps={this.onChangeOperatorQueryProps}
            queryModel={operatorQuery}
            selectOptions={this.setSelectOptions()}
            searchKey={this.paginationKey}
            searchBoxQueryModel={searchBoxQueryModel}
          />
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="명" />
            </SubActions.Left>
            <SubActions.Right>
              <Pagination.LimitSelect allViewable />
              <Button primary onClick={this.onRemoveOperators}>
                Delete
              </Button>
              <QuestionOperatorCreateModal />
            </SubActions.Right>
          </SubActions>
          <Loader>
            <QuestOperatorListView
              getOperatorGroupName={this.getOperatorGroupName}
              onClickOperatorCheckBox={this.onClickOperatorCheckBox}
              onClickAllCheckBox={this.onClickAllCheckBox}
              operators={operators}
              selectedOperatorIds={selectedOperatorIds}
              startNo={startNo}
            />
          </Loader>
          <Pagination.Navigator />
        </Pagination>
      </Container>
    );
  }
}

export default withRouter(QuestionOperatorListContainer);
