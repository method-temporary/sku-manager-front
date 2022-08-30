import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import {
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  PageTitle,
  Pagination,
  SubActions,
  Polyglot,
} from 'shared/components';
import { yesNoToBooleanUndefined, setOffsetLimit } from 'shared/helper';

import { displayManagementUrl } from 'Routes';
import { UserGroupService } from '../../../usergroup';
import { CardBundleService } from '../../index';
import CardBundleSearchView from '../view/CardBundleSearchView';
import CardBundleListView from '../view/CardBundleListView';
import CardBundleListSubActionsButtonView from '../view/CardBundleListSubActionsButtonView';
import { UserWorkspaceService } from '../../../userworkspace';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface Injected {
  cardBundleService: CardBundleService;
  sharedService: SharedService;
  userGroupService: UserGroupService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('cardBundleService', 'sharedService', 'userGroupService', 'userWorkspaceService')
@observer
@reactAutobind
class CardBundleListContainer extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'card-bundles';

  componentDidMount(): void {
    //
    this.init();
  }

  async init(): Promise<void> {
    await this.injected.userGroupService.findUserGroupMap();
  }

  async findCardBundleList() {
    //
    this.clear();

    const { cardBundleService, sharedService } = this.injected;
    const { cardBundleRdo, changeCardBundleRdoProps } = cardBundleService;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    setOffsetLimit(changeCardBundleRdoProps, pageModel);

    const offsetElementList = await cardBundleService.findAllCardBundles(cardBundleRdo);
    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  clear() {
    const { cardBundleService } = this.injected;
    cardBundleService.clearCardBundle();
    cardBundleService.clearFileName();
    cardBundleService.clearCardBundles();
    cardBundleService.changeCardBundleQueryProps('types', []);
  }

  routeToCreateCardBundle() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/cardBundle/cardBundle-create`
    );
  }

  routeToCardBundleDetail(cardBundleId: string) {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/cardBundle/cardBundle-create/${cardBundleId}`
    );
  }

  changeTargetCardBundleProps(index: number, name: string, value: any) {
    const { cardBundleService } = this.injected;

    cardBundleService.changeTargetCardBundleProps(index, name, value);
  }

  changeCardBundleRdoEnabled(value: string) {
    //
    const { cardBundleService } = this.injected;

    cardBundleService.changeCardBundleRdoProps('enabled', yesNoToBooleanUndefined(value));
  }

  onChangeCheckBox(value: boolean) {
    // TableHeader의 CheckBox를 처리하는 함수
    const { cardBundleService } = this.injected;
    cardBundleService.cardBundleForms.forEach((cardBundle, idx) => {
      cardBundleService.changeTargetCardBundleProps(idx, 'checked', value);
    });
  }

  onRemoveCardBundle() {
    //
    const { cardBundleService } = this.injected;
    if (cardBundleService.cardBundleForms.filter((cardBundle) => cardBundle.checked).length <= 0) {
      alert(AlertModel.getCustomAlert(false, ' ', '선택된 CardBundle이 없습니다.', '확인', () => {}));
      return;
    }

    this.removeConfirm();
  }

  async removeSuccessAlert() {
    //
    const { cardBundleService } = this.injected;

    await cardBundleService.removeCardBundles(
      cardBundleService.cardBundleForms.filter((cardBundle) => cardBundle.checked).map((cardBundle) => cardBundle.id)
    );

    alert(AlertModel.getRemoveSuccessAlert());
    await this.findCardBundleList();
  }

  removeConfirm() {
    //
    confirm(ConfirmModel.getRemoveConfirm(this.removeSuccessAlert), false);
  }

  async onModifyEnableCardBundles() {
    //
    const { cardBundleService } = this.injected;

    await cardBundleService.enableCardBundles(
      cardBundleService.cardBundleForms.filter((cardBundle) => cardBundle.checked).map((cardBundle) => cardBundle.id)
    );
    cardBundleService.clearCardBundles();
    alert(AlertModel.getCustomAlert(false, '사용 처리', '사용 처리 되었습니다.', '확인', () => {}));

    await this.findCardBundleList();
  }

  async onModifyDisableCardBundles() {
    const { cardBundleService } = this.injected;

    await cardBundleService.disableCardBundles(
      cardBundleService.cardBundleForms.filter((cardBundle) => cardBundle.checked).map((cardBundle) => cardBundle.id)
    );
    cardBundleService.clearCardBundles();
    alert(AlertModel.getCustomAlert(false, '사용중지 처리', '사용중지 처리 되었습니다.', '버튼명', () => {}));

    await this.findCardBundleList();
  }

  getSubsidiary(cineroomId: string): string | undefined {
    const { userWorkspaceMap } = this.injected.userWorkspaceService;
    return userWorkspaceMap.get(cineroomId);
  }

  render() {
    //
    const { userGroupService } = this.injected;
    const { cardBundleRdo, changeCardBundleRdoProps, cardBundleQuery, cardBundleForms } =
      this.injected.cardBundleService;
    const { count, startNo } = this.injected.sharedService.getPageModel(this.paginationKey);

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.cardBundleSections}>CardBundle Management</PageTitle>

        <Polyglot languages={cardBundleQuery.langSupports}>
          <CardBundleSearchView
            onSearchCardBundleList={this.findCardBundleList}
            changeCardBundleRdoProps={changeCardBundleRdoProps}
            changeCardBundleRdoEnabled={this.changeCardBundleRdoEnabled}
            cardBundleRdo={cardBundleRdo}
            paginationKey={this.paginationKey}
          />
          <SubActions>
            <SubActions.Left>
              <SubActions.Count number={count} text="개" />
            </SubActions.Left>

            <CardBundleListSubActionsButtonView
              routeToCreateCardBundle={this.routeToCreateCardBundle}
              onRemoveCardBundle={this.onRemoveCardBundle}
              onModifyEnableCardBundles={this.onModifyEnableCardBundles}
              onModifyDisableCardBundles={this.onModifyDisableCardBundles}
            />
          </SubActions>

          <Pagination name={this.paginationKey} onChange={this.findCardBundleList}>
            <CardBundleListView
              routeToCardBundleDetail={this.routeToCardBundleDetail}
              changeTargetCardBundleProps={this.changeTargetCardBundleProps}
              onChangeCheckBox={this.onChangeCheckBox}
              getSubsidiary={this.getSubsidiary}
              cardBundleForms={cardBundleForms}
              startNo={startNo}
              typeCheckBox
              selectable
              userGroupMap={userGroupService.userGroupMap}
            />
            <Pagination.Navigator />
          </Pagination>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(CardBundleListContainer);
