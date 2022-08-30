import * as React from 'react';
import { observer } from 'mobx-react';
import { Icon, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BannerModel } from '../..';
import { PatronKey } from 'shared/model';

interface Props {
  routeToDetailBanner: (bannerId: string) => void;
  getSubsidiary?: (cineroomId: string) => string | undefined;

  startNo: number;
  banners: BannerModel[];
  totalCount: number;
  bannerCount: any;
  pageIndex: number;
}

@observer
@reactAutobind
class BannerListView extends React.Component<Props> {
  //
  static defaultProps = {
    getSubsidiary: () => {},
  };

  render() {
    const { banners, routeToDetailBanner, startNo, getSubsidiary } = this.props;
    return (
      <>
        <Table celled selectable>
          <colgroup>
            <col width="9%" />
            <col />
            <col width="9%" />
            <col width="9%" />
            <col width="10%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Banner 명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">사용처</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">생성 및 최종 변경 일자</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(banners &&
              banners.length &&
              banners.map((banner: BannerModel, index) => {
                const newBanner = new BannerModel(banner);
                return (
                  <Table.Row key={index} onClick={() => routeToDetailBanner(newBanner.id)}>
                    <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                    <Table.Cell>
                      <p>{newBanner.name}</p>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {getSubsidiary && getSubsidiary(PatronKey.getCineroomId(newBanner.patronKey))}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{getPolyglotToAnyString(newBanner.registrantName)}</Table.Cell>
                    <Table.Cell textAlign="center">{newBanner.getCreationDate}</Table.Cell>
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
      </>
    );
  }
}

export default BannerListView;
