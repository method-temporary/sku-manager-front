import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Table, Grid } from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import CollegeService from '../../present/logic/CollegeService';
import { CollegeBannerModel } from '../../model/CollegeBannerModel';
import { PatronKey } from 'shared/model';

interface Props extends RouteComponentProps<{ coursePlanId: string }> {
  collegeService?: CollegeService;
  routeToCreateCollegeBanner: () => void;
  handleClickCollegeBannerRow: (collegeBannerId: string) => void;
  getCollegeName: (collegeId: string) => string;
  getSubsidiary?: (cineroomId: string) => string | undefined;

  result: CollegeBannerModel[];
  totalCount: number;
  pageIndex: number;
}

interface States {}

@inject('collegeService')
@observer
@reactAutobind
class CollegeBannerListView extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      routeToCreateCollegeBanner,
      handleClickCollegeBannerRow,
      getCollegeName,
      getSubsidiary,
      result,
      totalCount,
      pageIndex,
    } = this.props;
    return (
      <>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}>
              {(totalCount && (
                <span>
                  전체<strong> {totalCount}</strong>개 Banner 등록
                </span>
              )) ||
                ''}
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="right">
                <Button onClick={routeToCreateCollegeBanner}>
                  <Icon name="plus" />
                  Create
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table celled selectable>
          <colgroup>
            <col width="5%" />
            <col width="50%" />
            <col width="10%" />
            <col width="10%" />
            <col width="5%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Banner명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">사용처</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Category명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">공개여부</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">생성일자</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(result &&
              result.length &&
              result.map((banner: CollegeBannerModel, index) => {
                return (
                  <Table.Row key={index} onClick={() => handleClickCollegeBannerRow(banner.id)}>
                    <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                    <Table.Cell>
                      <a>{banner.title}</a>
                    </Table.Cell>
                    <Table.Cell>{getSubsidiary && getSubsidiary(PatronKey.getCineroomId(banner.patronKey))}</Table.Cell>
                    <Table.Cell textAlign="center">{getCollegeName(banner.collegeId)}</Table.Cell>
                    <Table.Cell textAlign="center">{banner.visible === 1 ? 'Y' : 'N'}</Table.Cell>
                    <Table.Cell>
                      {getPolyglotToAnyString(banner.registrantName, getDefaultLanguage(banner.langSupports))}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{moment(banner.registeredTime).format('YYYY.MM.DD')}</Table.Cell>
                  </Table.Row>
                );
              })) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={6}>
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

export default withRouter(CollegeBannerListView);
