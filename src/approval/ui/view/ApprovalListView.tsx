import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Table } from 'semantic-ui-react';
import numeral from 'numeral';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { ApprovalCubeModel } from 'approval/model/ApprovalCubeModel';

import ApprovalCubeService from '../../present/logic/ApprovalCubeService';

interface Props {
  approvalCubeService: ApprovalCubeService;
  totalCount: number;
  handleClickCubeRow: (cubeId: string) => void;
  searchState: any;
  pageIndex: number;
}

@reactAutobind
@observer
class ApprovalListView extends React.Component<Props> {
  //

  removeInList(index: number, oldList: string[]) {
    //
    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  checkOne(cubeId: string) {
    //
    const { selectedList } = this.props.approvalCubeService || ({} as ApprovalCubeService);
    const tempList: string[] = [...selectedList];
    if (tempList.indexOf(cubeId) !== -1) {
      const newTempStudentList = this.removeInList(tempList.indexOf(cubeId), tempList);
      this.onChangeSelectedStudentProps(newTempStudentList);
    } else {
      tempList.push(cubeId);
      this.onChangeSelectedStudentProps(tempList);
    }
  }

  onChangeSelectedStudentProps(selectedList: string[]) {
    //
    const { approvalCubeService } = this.props;
    if (approvalCubeService) {
      approvalCubeService.changeSelectedStudentProps(selectedList);
    }
  }

  getStateName(proposalState: string) {
    //
    if (proposalState && proposalState === 'Approved') {
      return '승인';
    }
    if (proposalState && proposalState === 'Submitted') {
      return '승인대기';
    }
    if (proposalState && proposalState === 'Canceled') {
      return '취소';
    }
    if (proposalState && proposalState === 'Rejected') {
      return '반려';
    }
    return '';
  }

  render() {
    const { approvalCubeService, totalCount, handleClickCubeRow, searchState, pageIndex } = this.props;
    const { approvalCubeOffsetList } = approvalCubeService!;
    const { results: approvalCubes } = approvalCubeOffsetList;
    let approvalNameVal = '신청일자';

    if (searchState === 'Submitted') {
      approvalNameVal = '신청일자';
    } else if (searchState === 'Rejected') {
      approvalNameVal = '반려일자';
    } else if (searchState === 'Approved') {
      approvalNameVal = '승인일자';
    } else {
      approvalNameVal = '신청일자';
    }

    const approvalDateName = approvalNameVal;
    const noTitle = '승인요청 학습이 없습니다.';

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="9%" />
          <col width="9%" />
          <col width="9%" />
          <col />
          <col width="4%" />
          <col width="5%" />
          <col width="6%" />
          <col width="6%" />
          <col width="13%" />
          <col width="6%" />
          <col width="7%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">신청자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">email</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">회사</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">조직</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">차수</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">신청현황</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">신청상태</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">이수여부</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">(차수)교육기간</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">{approvalDateName}</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">인당 교육금액</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {totalCount < 1 && (
            <Table.Row className="row">
              <Table.Cell colSpan={12}>
                <div className="no-cont-wrap">
                  <Icon className="no-contents80" />
                  <span className="blind">콘텐츠 없음</span>
                  <div className="text">{noTitle}</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
          {approvalCubes.map((cube, index) => (
            <Table.Row className="row" key={index} onClick={() => handleClickCubeRow(cube.studentId)}>
              <Table.Cell textAlign="center">{totalCount - pageIndex - index}</Table.Cell>
              <Table.Cell textAlign="center">{cube.studentName}</Table.Cell>
              <Table.Cell>{cube.email}</Table.Cell>
              <Table.Cell textAlign="center">{getPolyglotToAnyString(cube.studentCompanyNamesJson)}</Table.Cell>
              <Table.Cell textAlign="center">{getPolyglotToAnyString(cube.studentDepartmentNames)}</Table.Cell>
              <Table.Cell>{getPolyglotToAnyString(cube.cubeName)}</Table.Cell>
              <Table.Cell textAlign="center">{cube.round}</Table.Cell>
              <Table.Cell textAlign="center">
                {cube.approvedStudentCount}/{cube.capacity}
              </Table.Cell>
              <Table.Cell textAlign="center">{this.getStateName(cube.proposalState)}</Table.Cell>
              <Table.Cell textAlign="center">
                {(cube.proposalState === 'Approved' && !cube.learningState && '학습예정') ||
                  (cube.learningState && ApprovalCubeModel.getLearningStateName(cube.learningState)) ||
                  ''}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {/*{cube.enrolling.learningPeriod.startDate} ~ {cube.enrolling.learningPeriod.endDate}*/}
                {cube.learningStartDate} ~ {cube.learningEndDate}
              </Table.Cell>
              {/*<Table.Cell textAlign="center">{cube.time && moment(cube.time).format('YYYY.MM.DD')}</Table.Cell>*/}
              <Table.Cell textAlign="center">
                {cube.registeredTime && moment(cube.registeredTime).format('YYYY.MM.DD')}
              </Table.Cell>
              <Table.Cell textAlign="right" style={{ display: 'table-cell' }}>
                {/*{numeral(cube.freeOfCharge.chargeAmount).format('0,0')}*/}
                {numeral(cube.chargeAmount).format('0,0')}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default ApprovalListView;
