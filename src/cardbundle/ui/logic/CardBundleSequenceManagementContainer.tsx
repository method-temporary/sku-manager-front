import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { Button, Container } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { MYSUNI_CINEROOMID, PageModel, PatronKey, SelectType } from 'shared/model';
import { alert, AlertModel, PageTitle, SubActions } from 'shared/components';

import { CardBundleType } from '_data/arrange/cardBundles/model/vo';

import { UserWorkspaceService } from '../../../userworkspace';
import { CardBundleService } from '../../index';
import { CardBundleQueryModel } from '../../model/CardBundleQueryModel';
import CardBundleListView from '../view/CardBundleListView';
import { CardBundleFormModel } from '../../present/logic/CardBundleFormModel';
import { CardBundleModifyModel } from 'cardbundle/present/logic/CardBundleModifyModel';
import { MenuAuthority } from 'shared/ui';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface Injected {
  cardBundleService: CardBundleService;
  sharedService: SharedService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('cardBundleService', 'sharedService', 'userWorkspaceService')
@observer
@reactAutobind
class CardBundleSequenceManagementContainer extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'card-bundles';

  componentDidMount(): void {
    //
    this.clear();
    this.findCardBundleList();
  }

  async findCardBundleList() {
    //
    const { cardBundleService, sharedService } = this.injected;

    cardBundleService.changeCardBundleQueryProps('types', [
      CardBundleType.Normal,
      CardBundleType.New,
      CardBundleType.Popular,
      CardBundleType.Recommended,
      CardBundleType.Mobile,
    ]);
    const offsetElementList = await cardBundleService.findAllCardBundles(
      CardBundleQueryModel.asBardBundleCdoModel(cardBundleService.cardBundleQuery, new PageModel(0, 99999))
    );
    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);

    const filtered = this.injected.cardBundleService.cardBundleForms.filter(
      (c) => c.enabled && PatronKey.getCineroomId(c.patronKey) === this.props.match.params.cineroomId
    );

    cardBundleService.changeCardBundleFiltered(filtered);
  }

  clear() {
    const { cardBundleService } = this.injected;
    cardBundleService.clearCardBundle();
    cardBundleService.clearCardBundleQuery();
    cardBundleService.clearCardBundles();
  }

  changeCardBundleSequence(
    cardBundleForms: CardBundleFormModel[],
    cardBundleForm: CardBundleFormModel,
    oldSeq: number,
    newSeq: number
  ) {
    const { cardBundleService } = this.injected;
    cardBundleService.changeCardBundleSequence(cardBundleForms, cardBundleForm, oldSeq, newSeq);
  }

  async onModifyCardBundlesDisplayOrder() {
    const { cardBundleService } = this.injected;
    const mobileCardBundle = cardBundleService.cardBundleForms.filter((item) => item.type === 'Mobile');
    const isMysuniCineroom = this.props.match.params.cineroomId === MYSUNI_CINEROOMID;
    const params: CardBundleModifyModel = {
      cardBundleIdAndTypes: cardBundleService.cardBundleForms.reverse().map((item) => {
        return { id: item.id, cardBundleType: item.type };
      }),
    };

    //마이써니
    if (mobileCardBundle.length !== 0 && isMysuniCineroom) {
      params.cardBundleMobileOrderType = cardBundleService.cardBundleMobileOrderType;
    }

    await cardBundleService.modifyCardBundlesDisplayOrder(params);
    alert(AlertModel.getSaveSuccessAlert());
    await this.findCardBundleList();
  }

  getSubsidiary(cineroomId: string): string | undefined {
    const { userWorkspaceMap } = this.injected.userWorkspaceService;
    return userWorkspaceMap.get(cineroomId);
  }

  render() {
    //
    const { cardBundleForms } = this.injected.cardBundleService;
    const { startNo } = this.injected.sharedService.getPageModel(this.paginationKey);

    const notMobileCardBundle = cardBundleForms.filter((item) => item.type !== 'Mobile');
    const mobileCardBundle = cardBundleForms.filter((item) => item.type === 'Mobile');

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.cardBundleOrderSections}>
          CardBundle Bundle Display Order Management
        </PageTitle>
        <CardBundleListView
          changeCardBundleSequence={this.changeCardBundleSequence}
          getSubsidiary={this.getSubsidiary}
          cardBundleForms={notMobileCardBundle}
          startNo={startNo}
          typeCheckBox={false}
          selectable={false}
          title="Card 묶음 순서 관리(PC,Mobile 공통)"
        />
        <MenuAuthority permissionAuth={{ isSuperManager: true }}>
          <CardBundleListView
            changeCardBundleSequence={this.changeCardBundleSequence}
            getSubsidiary={this.getSubsidiary}
            cardBundleForms={mobileCardBundle}
            startNo={startNo}
            typeCheckBox={false}
            selectable={false}
            title="Mobile 맞춤과정 관리"
            isMobileBundle={true}
          />
        </MenuAuthority>

        <SubActions form>
          <SubActions.Left>
            <Button onClick={this.findCardBundleList}> 초기화 </Button>
          </SubActions.Left>
          <SubActions.Right>
            <Button primary onClick={this.onModifyCardBundlesDisplayOrder}>
              저장
            </Button>
          </SubActions.Right>
        </SubActions>
      </Container>
    );
  }
}

export default CardBundleSequenceManagementContainer;
