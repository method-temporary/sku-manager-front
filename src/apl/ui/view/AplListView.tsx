import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { EnumUtil, AlertWin, AplStateView } from 'shared/ui';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { AplService } from '../..';
import { AplModel } from '../../model/AplModel';

interface Props {
  result: AplModel[];
  handleClickAplRow: (aplId: string) => void;
  startNo: number;
  aplService: AplService;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
}

interface States {
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: string;
}

@inject('aplService', 'sharedService')
@observer
@reactAutobind
class AplListView extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinOpen: false,
      alertMessage: '',
      alertIcon: '',
      alertTitle: '',
      alertType: '',
    };
  }

  confirmBlank(message: string | any) {
    //
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '저장 안내',
      alertIcon: 'triangle',
      alertType: '안내',
    });
  }

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleAlertOk(type: string) {
    //
    this.handleCloseAlertWin();
  }

  render() {
    const { result, handleClickAplRow, startNo, collegesMap, channelMap } = this.props;

    const { alertWinOpen, alertMessage, alertIcon, alertTitle, alertType } = this.state;

    return (
      <>
        <Table celled selectable>
          <colgroup>
            <col width="5%" />
            <col width="26%" />
            <col width="16%" />
            <col width="8%" />
            <col width="10%" />
            <col width="8%" />
            <col width="10%" />
            <col width="7%" />
            <col width="10%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell>교육명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Category/Channel</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">교육시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">생성자 eMail</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">상태</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">승인/반려일자</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(result &&
              result.length &&
              result.map((apl: AplModel, index) => (
                <Table.Row key={index} textAlign="center" onClick={() => handleClickAplRow(apl.id)}>
                  <Table.Cell>{startNo - index}</Table.Cell>
                  <Table.Cell textAlign="left">{apl.title}</Table.Cell>
                  <Table.Cell>{`${collegesMap.get(apl.collegeId)} / ${channelMap.get(apl.channelId)}`}</Table.Cell>
                  <Table.Cell>
                    {(apl.updateHour === 0 && apl.updateMinute === 0 ? apl.allowHour : apl.updateHour) +
                      'h ' +
                      (apl.updateHour === 0 && apl.updateMinute === 0 ? apl.allowMinute : apl.updateMinute) +
                      'm'}
                  </Table.Cell>
                  <Table.Cell>{moment(apl.registeredTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                  <Table.Cell>
                    {apl.registrantUserIdentity && getPolyglotToAnyString(apl.registrantUserIdentity.name)}
                  </Table.Cell>
                  <Table.Cell>{apl.registrantUserIdentity?.email}</Table.Cell>
                  <Table.Cell>{EnumUtil.getEnumValue(AplStateView, apl.state).get(apl.state)}</Table.Cell>
                  <Table.Cell>
                    {/*{apl.modifiedTime === 0*/}
                    {/*  ? moment(apl.allowTime).format('YYYY.MM.DD HH:mm:ss')*/}
                    {/*  : moment(apl.modifiedTime).format('YYYY.MM.DD HH:mm:ss')}*/}
                    {moment(apl.allowTime).format('YYYY.MM.DD HH:mm:ss')}
                  </Table.Cell>
                </Table.Row>
              ))) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={9}>
                  <div className="no-cont-wrap no-contents-icon">
                    <Icon className="no-contents80" />
                    <div className="sr-only">콘텐츠 없음</div>
                    <div className="text">등록된 개인학습과정이 없습니다.</div>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <AlertWin
          message={alertMessage}
          handleClose={this.handleCloseAlertWin}
          open={alertWinOpen}
          alertIcon={alertIcon}
          title={alertTitle}
          type={alertType}
          handleOk={this.handleAlertOk}
        />
      </>
    );
  }
}

export default AplListView;
