import * as React from 'react';
import { observer } from 'mobx-react';
import { Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { UserGroupRuleModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { getBasedAccessRuleView } from 'shared/helper';

import { BannerBundleWithBannerRom } from '../../../_data/arrange/bannnerBundles/model';
import { PatronKey } from 'shared/model';

interface Props {
  routeToDetailBannerBundle: (bannerId: string) => void;
  getSubsidiary?: (cineroomId: string) => string | undefined;

  bannerBundleWithBannerRom: BannerBundleWithBannerRom[];
  startNo: number;
  bannerCount: any;
  userGroupMap: Map<number, UserGroupRuleModel>;
}

@observer
@reactAutobind
class BannerBundleListView extends ReactComponent<Props> {
  //
  static defaultProps = {
    getSubsidiary: () => {},
  };

  render() {
    const { routeToDetailBannerBundle, bannerBundleWithBannerRom, startNo, userGroupMap, getSubsidiary } = this.props;

    return (
      <>
        <Table celled selectable>
          <colgroup>
            <col width="9%" />
            <col width="18%" />
            <col width="7%" />
            <col width="18%" />
            <col width="9%" />
            <col width="9%" />
            <col />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">BannerBundle명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">사용처</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">사용기간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">최종 변경 일자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">접근제어규칙</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(bannerBundleWithBannerRom &&
              bannerBundleWithBannerRom.length &&
              bannerBundleWithBannerRom.map((banner: BannerBundleWithBannerRom, index) => (
                <Table.Row key={index} onClick={() => routeToDetailBannerBundle(banner.id)}>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>
                    <p>{banner.name}</p>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {getSubsidiary && getSubsidiary(PatronKey.getCineroomId(banner.patronKey))}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {`${moment(banner.startDate).format('YYYY.MM.DD')} ~`}
                    {banner.endDate === null || banner.endDate === 0
                      ? null
                      : ` ${moment(banner.endDate).format('YYYY.MM.DD')}`}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{getPolyglotToAnyString(banner.registrantName)}</Table.Cell>
                  <Table.Cell textAlign="center">{moment(banner.modifiedTime).format('YYYY.MM.DD')}</Table.Cell>
                  <Table.Cell>
                    {banner &&
                      banner.groupBasedAccessRule &&
                      getBasedAccessRuleView(banner.groupBasedAccessRule, userGroupMap)}
                  </Table.Cell>
                </Table.Row>
              ))) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={5}>
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

export default BannerBundleListView;
