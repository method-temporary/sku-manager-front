import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import DataChannelModel from '../../model/DataChannelModel';
import moment from 'moment';

interface Props {
  channels: DataChannelModel[];
  startNo: number;
}

class DataChannelListView extends React.Component<Props> {
  //
  render() {
    //
    const { channels, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="15%" />
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="20%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>email</Table.HeaderCell>
            <Table.HeaderCell>회원명</Table.HeaderCell>
            <Table.HeaderCell>회사명</Table.HeaderCell>
            <Table.HeaderCell>소속부서명</Table.HeaderCell>
            <Table.HeaderCell>채널명</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {channels && channels.length ? (
            channels.map((channelViewModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{channelViewModel.email}</Table.Cell>
                  <Table.Cell>{channelViewModel.name}</Table.Cell>
                  <Table.Cell>{channelViewModel.companyName}</Table.Cell>
                  <Table.Cell>{channelViewModel.departmentName}</Table.Cell>
                  <Table.Cell>{channelViewModel.channelName}</Table.Cell>
                </Table.Row>
              );
            })
          ) : (
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
    );
  }
}

export default DataChannelListView;
