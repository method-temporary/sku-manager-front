import React from 'react';
import moment, { Moment } from 'moment';
import { inject, observer } from 'mobx-react';
import { Button, Checkbox, Form, Icon, Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { BannerSearchBox } from 'shared/ui';
import { SharedService } from 'shared/present';
import { Modal, Pagination } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BannerQueryModel } from '../../model/BannerQueryModel';
import { BannerBundleService, BannerModel, BannerService } from '../..';
import { BannerBundleFormModel } from 'banner/model/BannerBundleFormModel';

interface Props {
  //
  buttonText: string;
  readonly?: boolean;
}

interface Injected {
  sharedService: SharedService;
  bannerService: BannerService;
  bannerBundleService: BannerBundleService;
}

@inject('sharedService', 'bannerService', 'bannerBundleService')
@observer
@reactAutobind
class BannerListModal extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'bannel-modal';

  onOpenModal() {
    const { bannerService } = this.injected;

    bannerService.clearBanner();
    bannerService.clearBanners();
  }

  onCloseModal(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, close: () => void) {
    //
    const { bannerService } = this.injected;

    bannerService.clearBanner();
    close();
  }

  async findSearchBannerList() {
    //
    const { bannerService, sharedService } = this.injected;

    bannerService.clearBanners();
    const pageModel = sharedService.getPageModel(this.paginationKey);
    const offsetElementList = await bannerService.findSearchBanner(
      BannerQueryModel.asBannerRdo(bannerService.bannerQuery, pageModel)
    );
    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  onchangeBannerQueryProps(name: string, value: string | Moment | number) {
    const { bannerService } = this.injected;
    bannerService.changeBannerQueryProps(name, value);
  }

  clearBannerQueryProps() {
    //
    const { bannerService } = this.injected;
    bannerService.clearBannerQueryProps();
  }

  onChangeCheckBox(index: number, name: string, value: boolean) {
    // TableHeader의 CheckBox를 처리하는 함수
    const { bannerService } = this.injected;
    bannerService.changeTargetPageElementProps(index, name, value);
  }

  addBannerInBannerBundle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, close: () => void) {
    //
    const { bannerService, bannerBundleService } = this.injected;

    bannerService.banners.forEach((banner) => {
      if (banner.selected) {
        bannerBundleService.addBannerInBannerBundle(banner);
      }
    });

    bannerService.clearBanner();
    close();
  }

  render() {
    //
    const { buttonText, readonly } = this.props;
    const { bannerBundleForm } = this.injected.bannerBundleService;
    const { banners, bannerQuery } = this.injected.bannerService;

    const getIsDisabled = (exposureType: 'PC' | 'Mobile' | '' | null) => {
      if (bannerBundleForm.exposureType === null) {
        if (exposureType !== null) {
          return true;
        }
        return false;
      }

      if (bannerBundleForm.exposureType === 'PC') {
        if (exposureType === 'Mobile') {
          return true;
        }
        return false;
      }

      if (bannerBundleForm.exposureType === 'Mobile') {
        if (exposureType === 'PC') {
          return true;
        }
        return false;
      }
    };

    return (
      <Modal
        size="large"
        trigger={
          <Button disabled={readonly} type="button" onClick={this.onOpenModal}>
            {buttonText}
          </Button>
        }
        onMount={this.findSearchBannerList}
        modSuper={readonly}
      >
        <Modal.Header>Banner 검색</Modal.Header>
        <Modal.Content>
          <BannerSearchBox
            onSearch={this.findSearchBannerList}
            onChangeQueryProps={this.onchangeBannerQueryProps}
            onClearQueryProps={this.clearBannerQueryProps}
            queryModel={bannerQuery}
            collegeAndChannel
            defaultPeriod={1}
            searchBoxFlag="banner"
          />
          <Pagination name={this.paginationKey} onChange={this.findSearchBannerList}>
            <Table celled selectable>
              <colgroup>
                <col width="10%" />
                <col />
                <col width="15%" />
                <col width="20%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">선택</Table.HeaderCell>
                  <Table.HeaderCell textAlign="left">Banner 명</Table.HeaderCell>
                  <Table.HeaderCell textAlign="left">생성자</Table.HeaderCell>
                  <Table.HeaderCell textAlign="left">생성 및 최종 변경 일자</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(banners &&
                  banners.length &&
                  banners.map((banner: BannerModel, index) => {
                    return (
                      <Table.Row key={index}>
                        <Table.Cell textAlign="center">
                          <Form.Field
                            control={Checkbox}
                            value="1"
                            checked={banner && banner.selected}
                            disabled={getIsDisabled(banner.exposureType)}
                            onChange={(e: any, data: any) => this.onChangeCheckBox(index, 'selected', data.checked)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <p>{banner.name}</p>
                        </Table.Cell>
                        <Table.Cell>{getPolyglotToAnyString(banner.registrantName)}</Table.Cell>
                        <Table.Cell>{moment(banner.registeredTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                      </Table.Row>
                    );
                  })) || (
                  <Table.Row>
                    <Table.Cell textAlign="center" colSpan={4}>
                      <div className="no-cont-wrap no-contents-icon">
                        <Icon className="no-contents80" />
                        <div className="sr-only">콘텐츠 없음</div>
                        <div className="text">검색 결과를 찾을 수 없습니다.</div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>

            <Pagination.Navigator />
          </Pagination>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton primary onClickWithClose={this.onCloseModal}>
            Cancel
          </Modal.CloseButton>
          <Modal.CloseButton primary onClickWithClose={this.addBannerInBannerBundle}>
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default BannerListModal;
