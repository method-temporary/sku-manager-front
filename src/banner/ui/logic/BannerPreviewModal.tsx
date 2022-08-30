import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Menu, Tab, Modal } from 'semantic-ui-react';
import { SharedService } from 'shared/present';
import BannerService from '../../present/logic/BannerService';
import BannerPreviewListPcweb from '../view/BannerPreviewListPcweb';
import BannerPreviewListMobile from '../view/BannerPreviewListMobile';
import { BannerBundleService } from '../../index';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  open: boolean;
}

interface Injected {
  bannerService: BannerService;
  sharedService: SharedService;
  bannerBundleService: BannerBundleService;
}

@inject('bannerService', 'sharedService', 'bannerBundleService')
@observer
@reactAutobind
class BannerPreviewModal extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  onOpenModal(value: boolean) {
    //
    this.setState({ open: value });
  }

  render() {
    //
    const { bannerBundleService } = this.injected;
    const { selectedBanners } = bannerBundleService;

    const panes = [
      {
        menuItem: <Menu.Item key="pcweb">PC Web</Menu.Item>,
        render: () => (
          <Tab.Pane>
            <BannerPreviewListPcweb banners={selectedBanners} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: <Menu.Item key="mobile">Mobile</Menu.Item>,
        render: () => (
          <Tab.Pane>
            <BannerPreviewListMobile banners={selectedBanners} />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <>
        <Button size="mini" floated="right" type="button" onClick={() => this.onOpenModal(true)}>
          Banner 미리보기
        </Button>
        <Modal size="fullscreen" open={this.state.open} onClose={() => this.onOpenModal(false)}>
          <Modal.Header>Banner 미리보기</Modal.Header>
          <Modal.Content>
            {/*PC Web, Mobile 탭 구성*/}
            <Tab panes={panes} />
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => this.onOpenModal(false)}>
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default withRouter(BannerPreviewModal);
