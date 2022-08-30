import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import DataCommunityModel from '../../model/DataCommunityModel';
import moment from 'moment';
import { observable } from 'mobx';

interface Props {
  communitys: DataCommunityModel[];
  startNo: number;
}

class DataCommunityListView extends React.Component<Props> {
  //
  render() {
    //
    const { communitys, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="20%" />
          <col width="5%" />
          <col width="10%" />
          <col width="7%" />
          <col width="10%" />
          <col width="5%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>커뮤니티명</Table.HeaderCell>
            <Table.HeaderCell>회원명</Table.HeaderCell>
            <Table.HeaderCell>email</Table.HeaderCell>
            <Table.HeaderCell>회사</Table.HeaderCell>
            <Table.HeaderCell>부서</Table.HeaderCell>
            <Table.HeaderCell>닉네임</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {communitys && communitys.length ? (
            communitys.map((communityViewModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{communityViewModel.title}</Table.Cell>
                  <Table.Cell textAlign="center">{communityViewModel.userName}</Table.Cell>
                  <Table.Cell>{communityViewModel.email}</Table.Cell>
                  <Table.Cell>{communityViewModel.companyName}</Table.Cell>
                  <Table.Cell>{communityViewModel.departmentName}</Table.Cell>
                  <Table.Cell>{communityViewModel.nickname}</Table.Cell>
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

export default DataCommunityListView;
