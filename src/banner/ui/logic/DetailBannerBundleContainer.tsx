import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Button, Container, Form } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, GroupAccessRule, GroupBasedAccessRuleModel, UserGroupRuleModel } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import {
  AccessRuleSettings,
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  PageTitle,
  SubActions,
  Polyglot,
} from 'shared/components';

import { UserGroupService } from '../../../usergroup';
import { getBannerNameValueList } from '../../shared/util';
import BannerService from '../../present/logic/BannerService';
import { BannerBundleService, BannerModel } from '../..';
import OrderedBannerId from '../../model/OrderedBannerId';
import BannerCreateHistoryInfoView from '../view/BannerCreateHistoryInfoView';
import BannerBundleBaseInfoView from '../view/BannerBundleBaseInfoView';
import BannerBundleBannerListView from '../view/BannerBundleBannerListView';
import 'react-datepicker/dist/react-datepicker.css';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  bannerBundleId: string;
}

interface Injected {
  bannerService: BannerService;
  bannerBundleService: BannerBundleService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
}

interface States {
  filesMap: Map<string, any>;
  isUpdatable: boolean;
}

@inject('bannerService', 'bannerBundleService', 'accessRuleService', 'userGroupService')
@observer
@reactAutobind
class DetailBannerBundleContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      filesMap: new Map<string, any>(),
      isUpdatable: false,
    };
  }

  async componentDidMount() {
    //
    this.clearAll();
    if (this.props.match.params.bannerBundleId) {
      await this.findBannerBundle();
      await this.findGroupBasedAccessRules();
    } else {
      this.setState({ isUpdatable: true });
    }
  }

  async findBannerBundle() {
    //
    const { bannerBundleService } = this.injected;
    bannerBundleService.clearSelectedBanners();
    await bannerBundleService.findBannerBundleDetail(this.props.match.params.bannerBundleId);
    bannerBundleService.bannerBundleForm &&
      bannerBundleService.bannerBundleForm.banners &&
      bannerBundleService.bannerBundleForm.banners.map((banner) => bannerBundleService.addBannerInBannerBundle(banner));
  }

  async findGroupBasedAccessRules() {
    //
    const { bannerBundleService, accessRuleService, userGroupService } = this.injected;
    await userGroupService.findUserGroupMap();

    const accessRules: GroupAccessRule[] = bannerBundleService.bannerBundleForm.groupBasedAccessRule.accessRules.map(
      (accessRule): GroupAccessRule =>
        new GroupAccessRule(
          accessRule.groupSequences
            .map((groupSequence): UserGroupRuleModel => {
              const userGroup = userGroupService.userGroupMap.get(groupSequence);
              return new UserGroupRuleModel(
                userGroup?.categoryId,
                userGroup?.categoryName,
                userGroup?.userGroupId,
                userGroup?.userGroupName,
                userGroup?.seq
              );
            })
            .filter((userGroupRuleModel) => userGroupRuleModel.categoryId !== null)
        )
    );
    const groupBasedAccessRuleModel = new GroupBasedAccessRuleModel();

    groupBasedAccessRuleModel.useWhitelistPolicy =
      bannerBundleService.bannerBundleForm.groupBasedAccessRule.useWhitelistPolicy;
    groupBasedAccessRuleModel.accessRules = accessRules;

    accessRuleService.setGroupBasedAccessRule(groupBasedAccessRuleModel);
  }

  deleteBannerInBannerBundle(index: number) {
    const { bannerBundleService } = this.injected;
    bannerBundleService.removeBannerInBannerBundle(index);
  }

  changeBannerSequence(banner: BannerModel, oldSeq: number, newSeq: number): void {
    const { bannerBundleService } = this.injected;
    bannerBundleService.changeBannerSequence(banner, oldSeq, newSeq);
  }

  routeToBannerBundleList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/arrange-management/bannerBundles/bannerBundle-list`
    );
  }

  async onModifyBannerBundle() {
    //
    const { bannerBundleService, accessRuleService } = this.injected;
    const { bannerBundleForm } = bannerBundleService;

    const ids = bannerBundleService.selectedBanners.map(
      (banner, index) => new OrderedBannerId({ bannerId: banner.id, displayOrder: index })
    );
    bannerBundleService.changeBannerBundleProps('bannerIds', ids);
    bannerBundleService.changeBannerBundleProps(
      'groupBasedAccessRule',
      GroupBasedAccessRuleModel.asGroupBasedAccessRule(accessRuleService.groupBasedAccessRule)
    );

    if (this.bannerBundleValidationCheck()) {
      try {
        const errorMessage = await bannerBundleService.modifyBannerBundle(
          bannerBundleForm.id,
          getBannerNameValueList(bannerBundleForm)
        );
        if (errorMessage == 'BannerBundleContainsUnsupportedExposureTypedBanner') {
          alert(new AlertModel(false, '노출 타입 에러', '배너 번들의 노출 설정과 배너의 노출 설정이이 맞지 않습니다.'));
        } else {
          alert(AlertModel.getSaveSuccessAlert());
          this.clearAll();
          this.routeToBannerBundleList();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  bannerBundleValidationCheck(): boolean {
    //
    const { bannerBundleForm } = this.injected.bannerBundleService;
    let validation: boolean;

    if (bannerBundleForm.exposureType !== '') {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('노출 설정'));
      return validation;
    }

    // name validation
    if (bannerBundleForm.name != null && bannerBundleForm.name !== '') {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredInputAlert('이름'));
      return validation;
    }

    if (bannerBundleForm.groupBasedAccessRule.accessRules.length > 0) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('접근제어 정보 규칙'));
      return validation;
    }
    if (bannerBundleForm.bannerIds.length > 0) {
      validation = true;
    } else {
      validation = false;
      alert(AlertModel.getRequiredChoiceAlert('banner'));
      return validation;
    }

    return validation;
  }

  async onRemoveBannerBundle(bannerBundleId: string) {
    // deleteBannerBundle
    confirm(
      ConfirmModel.getRemoveConfirm(() => {
        this.removeBannerBundle(bannerBundleId);
      }),
      false
    );
  }

  async removeBannerBundle(bannerBundleId: string) {
    //
    const { bannerBundleService } = this.injected;

    await bannerBundleService.removeBannerBundle(bannerBundleId);
    alert(AlertModel.getRemoveSuccessAlert());
    this.routeToBannerBundleList();
  }

  clearAll() {
    //
    const { bannerBundleService } = this.injected;
    bannerBundleService.clearBannerBannerBundleForm();
    bannerBundleService.clearSelectedBanners();
  }

  onChangeBannerBundleProps(name: string, value: string | {} | []) {
    //
    const { bannerBundleService } = this.injected;
    bannerBundleService.changeBannerBundleProps(name, value);
  }

  onChangeBannerDateProps(name: string, value: number): void {
    //
    const { bannerBundleService } = this.injected;
    bannerBundleService.changeBannerBundleProps(name, value);

    if (bannerBundleService.bannerBundleForm.startDate > bannerBundleService.bannerBundleForm.endDate) {
      bannerBundleService.changeBannerBundleProps('endDate', value);
    }
  }

  async isUpdatableCheck(val: boolean): Promise<void> {
    //
    this.setState({ isUpdatable: val });
    if (!val) {
      await this.findBannerBundle();
      await this.findGroupBasedAccessRules();
    }
  }

  render() {
    //
    const { bannerBundleForm, selectedBanners, changeBannerBundleExposureType } = this.injected.bannerBundleService;
    const { bannerBundleId } = this.props.match.params;
    const { isUpdatable } = this.state;

    return (
      <Container fluid>
        <Polyglot languages={bannerBundleForm.langSupports}>
          <PageTitle breadcrumb={SelectType.OrganizationStateSection} />

          <div className="content">
            <BannerCreateHistoryInfoView bannerBundleForm={bannerBundleForm} />
            <Form>
              <BannerBundleBaseInfoView
                bannerBundleForm={bannerBundleForm}
                onChangeBannerProps={this.onChangeBannerBundleProps}
                onChangeBannerDateProps={this.onChangeBannerDateProps}
                changeBannerBundleExposureType={changeBannerBundleExposureType}
                isUpdatable={this.state.isUpdatable}
              />
            </Form>

            <AccessRuleSettings readOnly={!isUpdatable} multiple={false} />
            <BannerBundleBannerListView
              onChangeBannerSequence={this.changeBannerSequence}
              onDeleteBannerInBannerBundle={this.deleteBannerInBannerBundle}
              banners={selectedBanners}
              isUpdatable={this.state.isUpdatable}
            />

            <SubActions form>
              <SubActions.Left>
                <Button primary onClick={() => this.onRemoveBannerBundle(bannerBundleId)} type="button">
                  삭제
                </Button>
                {(bannerBundleId &&
                  ((!isUpdatable && <Button onClick={() => this.isUpdatableCheck(true)}> 수정 </Button>) || (
                    <Button onClick={() => this.isUpdatableCheck(false)}> 취소 </Button>
                  ))) ||
                  null}
              </SubActions.Left>
              <SubActions.Right>
                <Button onClick={this.routeToBannerBundleList} type="button">
                  목록
                </Button>
                <Button disabled={!isUpdatable} primary onClick={this.onModifyBannerBundle} type="button">
                  저장
                </Button>
              </SubActions.Right>
            </SubActions>
          </div>
        </Polyglot>
      </Container>
    );
  }
}

export default withRouter(DetailBannerBundleContainer);
