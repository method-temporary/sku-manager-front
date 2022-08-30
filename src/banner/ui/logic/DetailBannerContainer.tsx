import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, PageTitle, SubActions } from 'shared/components';

import BannerService from '../../present/logic/BannerService';
import BannerInfoContainer from './BannerInfoContainer';
import { BannerModel } from '../..';
import BannerCreateHistoryInfoView from '../view/BannerCreateHistoryInfoView';
import 'react-datepicker/dist/react-datepicker.css';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  bannerId: string;
}

interface Injected {
  bannerService: BannerService;
}

interface States {
  filesMap: Map<string, any>;
  isUpdatable: boolean;
}

@inject('bannerService')
@observer
@reactAutobind
class DetailBannerContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      filesMap: new Map<string, any>(),
      isUpdatable: false,
    };
  }

  componentDidMount(): void {
    // --
    this.clearAll();
    const { bannerId } = this.props.match.params;
    const { bannerService } = this.injected;
    if (bannerId) {
      bannerService.findBannerById(bannerId);
    }
  }

  clearAll() {
    //
    const { bannerService } = this.injected;
    if (bannerService) {
      bannerService.clearBanner();
      bannerService.clearBanners();
      bannerService.clearFileNamePc();
      bannerService.clearFileNameMobile();
    }
  }

  routeToBannerList() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/arrange-management/banners/banner-list`);
  }

  onChangeBannerEnrollmentProps(name: string, value: any) {
    //
    const { bannerService } = this.injected;
    let getTagList = [];
    if (bannerService && name === 'tags' && typeof value === 'string') {
      getTagList = value.split(',');
      bannerService.changeBannerProps('tags', getTagList);
      bannerService.changeBannerProps('tag', value);
    }
    if (bannerService && name !== 'tags') {
      bannerService.changeBannerProps(name, value);
    }
  }

  async onModifyBanner() {
    //
    const { bannerService } = this.injected;
    const { banner } = this.injected.bannerService;
    const bannerBlank = BannerModel.isBlank(banner);
    if (bannerBlank === 'success') {
      try {
        const errorMessage = await bannerService.modifyBanner(banner.id, BannerModel.asNameValueList(banner));
        if (errorMessage === 'BannerIsContainedByUnsupportedTypedBannerBundle') {
          alert(new AlertModel(false, '노출 타입 에러', '배너 번들의 노출 설정과 배너의 노출 설정이이 맞지 않습니다.'));
        } else {
          alert(AlertModel.getSaveSuccessAlert());
          this.routeToBannerList();
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      alert(AlertModel.getRequiredInputAlert(bannerBlank));
    }
  }

  async onModifyBannerConfirmOK() {
    //
    const { bannerService } = this.injected;
    const { banner } = bannerService;
    await bannerService.modifyBanner(banner.id, BannerModel.asNameValueList(banner));
    this.routeToBannerList();
  }

  onRemoveBanner() {
    //
    this.removeConfirm();
  }

  removeConfirm() {
    //
    confirm(ConfirmModel.getRemoveConfirm(this.removeSuccessAlert), false);
  }

  async removeSuccessAlert() {
    //
    const { bannerService } = this.injected;
    const { banner } = bannerService;

    await bannerService.removeBanner(banner.id);
    alert(AlertModel.getRemoveSuccessAlert());
    this.routeToBannerList();
  }

  async onRemoveBannerConfirmOK() {
    //
    const { bannerService } = this.injected;
    const { banner } = bannerService;

    await bannerService.removeBanner(banner.id);
    this.routeToBannerList();
  }

  changeUpdatableMode(val: boolean): void {
    //
    this.setState({ isUpdatable: val });
    if (!val) {
      const { bannerService } = this.injected;
      bannerService.findBannerById(this.props.match.params.bannerId);
    }
  }

  render() {
    //
    const { banner } = this.injected.bannerService;
    const { isUpdatable } = this.state;
    const { bannerId } = this.props.match.params;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.EnrollmentStateSection} />
        <div className="content">
          <SubActions form>
            <Form>
              <BannerCreateHistoryInfoView banner={banner} />
              <BannerInfoContainer onChangeBannerProps={this.onChangeBannerEnrollmentProps} isUpdatable={isUpdatable} />

              <SubActions.Left>
                <Button primary onClick={() => this.onRemoveBanner()} type="button">
                  삭제
                </Button>
                {(bannerId &&
                  ((!isUpdatable && <Button onClick={() => this.changeUpdatableMode(true)}> 수정 </Button>) || (
                    <Button onClick={() => this.changeUpdatableMode(false)}> 취소 </Button>
                  ))) ||
                  null}
              </SubActions.Left>
              <SubActions.Right>
                <Button basic onClick={this.routeToBannerList} type="button">
                  목록
                </Button>
                <Button disabled={!isUpdatable} primary onClick={this.onModifyBanner} type="button">
                  저장
                </Button>
              </SubActions.Right>
            </Form>
          </SubActions>
        </div>
      </Container>
    );
  }
}

export default withRouter(DetailBannerContainer);
