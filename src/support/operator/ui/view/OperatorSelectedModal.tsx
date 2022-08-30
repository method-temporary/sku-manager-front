import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { Loader, Pagination, SubActions, Modal } from 'shared/components';
import { SharedService } from 'shared/present';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';

import OperatorService from 'support/operator/present/logic/OperatorService';
import OperatorQueryModel from 'support/operator/model/OperatorQueryModel';
import OperatorWithUserIdentity from 'support/operator/model/sdo/OperatorWithUserIdentity';

import QuestOperatorSearchBox from './QuestOperatorSearchBox';
import QuestOperatorListView from './QuestOperatorListView';

interface Injected {
  operatorService: OperatorService;
  sharedService: SharedService;
  searchBoxService: SearchBoxService;
}

interface States {
  selectedOperatorList: OperatorWithUserIdentity[];
}

interface Props {
  readonly?: boolean;
  onClickOk: (operators: OperatorWithUserIdentity[]) => void;
}

@inject('operatorService', 'sharedService', 'searchBoxService')
@observer
@reactAutobind
class OperatorSelectedModal extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'qna-operator';

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedOperatorList: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    //
  }

  onOpenModal() {
    //
    const { operatorService } = this.injected;
    operatorService.findAllOperatorGroup();
  }

  onCloseModal(close: () => void) {
    //
    this.init();

    close();
  }

  async onClickOkButton(close: () => void) {
    //
    const { onClickOk } = this.props;
    const { selectedOperatorList } = this.state;

    await onClickOk(selectedOperatorList);

    await this.setState({ selectedOperatorList: [] });

    close();
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
  }

  onClickAllCheckBox(value: boolean): void {
    //
  }

  async onClickOpeartorCheckBoxInModal(operator: OperatorWithUserIdentity) {
    //
    const { selectedOperatorList } = this.state;

    const tempList = [...selectedOperatorList];

    if (tempList.some((target) => target.operator.id === operator.operator.id)) {
      await tempList.splice(
        tempList.findIndex((target) => target.operator.id === operator.operator.id),
        1
      );
    } else {
      await tempList.push(operator);
    }

    await this.setState({
      selectedOperatorList: tempList,
    });
  }

  onClickAllCheckBoxInModal(value: boolean): void {
    //
    const { operatorService } = this.injected;
    const { operators } = operatorService;

    if (value) {
      this.setState({
        selectedOperatorList: operators,
      });
    } else {
      this.setState({
        selectedOperatorList: [],
      });
    }
  }

  render() {
    const { operatorService, sharedService, searchBoxService } = this.injected;
    const { count, startNo } = sharedService.getPageModel(this.paginationKey);
    const { searchBoxQueryModel } = searchBoxService;
    const { operators, operatorQuery } = operatorService;
    const { readonly } = this.props;
    const { selectedOperatorList } = this.state;

    const selectedIds =
      (selectedOperatorList &&
        selectedOperatorList.length > 0 &&
        selectedOperatorList.map((operator) => operator.userIdentity.id)) ||
      [];

    return (
      <Modal
        size="large"
        triggerAs="a"
        modSuper={readonly}
        trigger={
          <Button disabled={readonly} onClick={this.onOpenModal}>
            담당자 선택
          </Button>
        }
        // onMount={this.onMount}
      >
        <Modal.Header className="res">담당자 선택</Modal.Header>
        <Modal.Content className="fit-layout">
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
            </SubActions>
            <Loader>
              <QuestOperatorListView
                getOperatorGroupName={this.getOperatorGroupName}
                onClickOperatorCheckBox={this.onClickOperatorCheckBox}
                onClickAllCheckBox={this.onClickAllCheckBox}
                operators={operators}
                selectedOperatorIds={selectedIds}
                startNo={startNo}
                isModal={true}
                onClickOperatorCheckBoxInModal={this.onClickOpeartorCheckBoxInModal}
                onClickAllOperatorCheckBixInModal={this.onClickAllCheckBoxInModal}
              />
            </Loader>
            <Pagination.Navigator />
          </Pagination>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton primary onClickWithClose={(e, close) => this.onCloseModal(close)}>
            Cancel
          </Modal.CloseButton>
          <Modal.CloseButton primary onClickWithClose={(e, close) => this.onClickOkButton(close)}>
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default OperatorSelectedModal;
