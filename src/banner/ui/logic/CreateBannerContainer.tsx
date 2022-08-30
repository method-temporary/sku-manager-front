import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import depot from '@nara.drama/depot';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { alert, AlertModel, PageTitle, SubActions } from 'shared/components';

import BannerService from '../../present/logic/BannerService';
import BannerInfoContainer from './BannerInfoContainer';
import { BannerModel } from '../..';
import 'react-datepicker/dist/react-datepicker.css';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  cubeId: string;
  cubeType: string;
}

interface Injected {
  bannerService: BannerService;
}

interface States {
  filesMap: Map<string, any>;
}

@inject('bannerService')
@observer
@reactAutobind
class CreateBannerContainer extends ReactComponent<Props, States, Injected> {
  //
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
    const { bannerService } = this.injected;
    if (bannerService) {
      bannerService.clearBanner();
      bannerService.clearFileNamePc();
      bannerService.clearFileNameMobile();
    }
  }

  findFiles(type: string, fileBoxId: string) {
    const { filesMap } = this.state;
    depot.getDepotFiles(fileBoxId).then((files) => {
      filesMap.set(type, files);
      const newMap = new Map(filesMap.set(type, files));
      this.setState({ filesMap: newMap });
    });
  }

  onChangeBannerProps(name: string, value: string | {} | []) {
    // --
    const { bannerService } = this.injected;
    bannerService.changeBannerProps(name, value);
  }

  async handleSave() {
    //
    const { bannerService } = this.injected;
    const { banner } = bannerService;
    const bannerObject = BannerModel.isBlank(banner);
    if (bannerObject === 'success') {
      try {
        const errorMessage = await bannerService.registerBanner();
        if (errorMessage === 'BannerIsContainedByUnsupportedTypedBannerBundle') {
          alert(new AlertModel(false, '노출 타입 에러', '배너 번들의 노출 설정과 배너의 노출 설정이이 맞지 않습니다.'));
        } else {
          alert(AlertModel.getSaveSuccessAlert());
          this.routeToBannerList();
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (bannerObject !== 'success') {
      alert(AlertModel.getRequiredInputAlert(bannerObject));
    }
  }

  routeToBannerList() {
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/arrange-management/banners/banner-list`);
  }

  render() {
    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.EnrollmentStateSection} />
        <div className="content">
          <Form>
            <BannerInfoContainer onChangeBannerProps={this.onChangeBannerProps} isUpdatable={true} />

            <SubActions form>
              <SubActions.Right>
                <Button onClick={this.routeToBannerList} type="button">
                  목록
                </Button>
                <Button primary onClick={this.handleSave} type="button">
                  저장
                </Button>
              </SubActions.Right>
            </SubActions>
          </Form>
        </div>
      </Container>
    );
  }
}

export default withRouter(CreateBannerContainer);
