import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Button, Container, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { GroupBasedAccessRuleModel, SelectType } from 'shared/model';
import { SharedService, AccessRuleService } from 'shared/present';
import { AccessRuleSettings, alert, AlertModel, SubActions, Polyglot } from 'shared/components';

import { getBannerBundleCdo } from '../../shared/util/bannerbundle.util';
import BannerService from '../../present/logic/BannerService';
import { BannerBundleService, BannerModel } from '../..';
import BannerBundleBannerListView from '../view/BannerBundleBannerListView';
import BannerBundleBaseInfoView from '../view/BannerBundleBaseInfoView';
import OrderedBannerId from '../../model/OrderedBannerId';
import 'react-datepicker/dist/react-datepicker.css';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  cubeId: string;
  cubeType: string;
}

interface Injected {
  bannerService: BannerService;
  bannerBundleService: BannerBundleService;
  sharedService: SharedService;
  accessRuleService: AccessRuleService;
}

interface States {
  filesMap: Map<string, any>;
}

@inject('bannerService', 'bannerBundleService', 'sharedService', 'accessRuleService')
@observer
@reactAutobind
class CreateBannerBundleContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'banner-modal';

  constructor(props: Props) {
    super(props);
    this.state = {
      filesMap: new Map<string, any>(),
    };
  }

  componentDidMount(): void {
    //
    this.clearAll();
  }

  clearAll() {
    //
    const { bannerService, bannerBundleService } = this.injected;

    bannerService.clearBanner();
    bannerService.clearBanners();
    bannerBundleService.clearSelectedBanners();
    bannerBundleService.clearBannerBannerBundleForm();
    bannerService.clearFileNamePc();
    bannerService.clearFileNameMobile();
  }

  changeBannerSequence(banner: BannerModel, oldSeq: number, newSeq: number) {
    const { bannerBundleService } = this.injected;
    bannerBundleService.changeBannerSequence(banner, oldSeq, newSeq);
  }

  deleteBannerInBannerBundle(index: number) {
    const { bannerBundleService } = this.injected;
    bannerBundleService.removeBannerInBannerBundle(index);
  }

  routeToBannerBundleList() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/arrange-management/bannerBundles/bannerBundle-list`
    );
  }

  onChangeBannerProps(name: string, value: string | {} | []) {
    //
    const { bannerBundleService } = this.injected;
    if (name !== 'tags') {
      bannerBundleService.changeBannerBundleFormProps(name, value);
    }
  }

  onChangeBannerDateProps(name: string, value: number): void {
    //
    const { bannerBundleService } = this.injected;
    bannerBundleService.changeBannerBundleFormProps(name, value);
  }

  async handleSave() {
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
        const errorMessage = await bannerBundleService.registerBannerBundle(getBannerBundleCdo(bannerBundleForm));
        if (errorMessage === 'BannerBundleContainsUnsupportedExposureTypedBanner') {
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
      alert(AlertModel.getRequiredInputAlert('BanerBundle명'));
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

  render() {
    //
    const { bannerBundleService } = this.injected;
    const { bannerBundleForm, selectedBanners, changeBannerBundleExposureType } = bannerBundleService;

    return (
      <Container fluid>
        <Polyglot languages={bannerBundleForm.langSupports}>
          <div>
            <Breadcrumb icon="right angle" sections={SelectType.OrganizationStateSection} />
            <Header as="h2">Banner 편성관리</Header>
          </div>
          <div className="content">
            <Form>
              <BannerBundleBaseInfoView
                bannerBundleForm={bannerBundleForm}
                onChangeBannerProps={this.onChangeBannerProps}
                onChangeBannerDateProps={this.onChangeBannerDateProps}
                changeBannerBundleExposureType={changeBannerBundleExposureType}
                isUpdatable
              />
            </Form>

            <AccessRuleSettings multiple={false} />
            <BannerBundleBannerListView
              onChangeBannerSequence={this.changeBannerSequence}
              onDeleteBannerInBannerBundle={this.deleteBannerInBannerBundle}
              banners={selectedBanners}
              isUpdatable
            />

            <SubActions form>
              <SubActions.Right>
                <Button basic onClick={this.routeToBannerBundleList} type="button">
                  목록
                </Button>
                <Button primary onClick={this.handleSave} type="button">
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

export default withRouter(CreateBannerBundleContainer);
