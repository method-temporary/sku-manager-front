import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQueryClient } from 'react-query';
import { Icon, Pagination, PaginationProps, Select, Table, DropdownProps, Dimmer, Loader } from 'semantic-ui-react';
import { preFetchFindStudentApprovalsForAdmin, useFindStudentApprovalsForAdmin } from '../paidCourse.hooks';
import { getApprovalName, getCardCompleteNumber, getStateName, parseLearningState } from '../utils';
import { useHistory } from 'react-router-dom';
import { patronInfo } from '@nara.platform/dock';
import { learningManagementUrl } from 'Routes';
import { getItemNo } from 'shared/helper/getItemNo';
import { SubActions } from 'shared/components';
import { SelectType } from 'shared/model';
import { ApprovalCubeXlsxModel } from 'approval/model/ApprovalCubeXlsxModel';
import { ApprovalCubeModel } from 'approval/model/ApprovalCubeModel';
import { PaidCourseSortOrder } from '_data/lecture/students/model/PaidCourseSortOrder';
import ApprovalCubeService from 'approval/present/logic/ApprovalCubeService';
import numeral from 'numeral';
import PaidCourseStore from '../paidCourse.store';
import dayjs from 'dayjs';
import XLSX from 'xlsx';
import { findStudentApprovalsForAdmin } from '_data/lecture/students/api/studentApi';
import { PaidCourse } from '_data/lecture/students/model/PaidCourse';

export const PaidCourseTable = observer(() => {
  // const queryClient = useQueryClient();
  const { paidCourseState, paidCourseQuery, setSortOrder, setLimit, setOffset } = PaidCourseStore.instance;

  const history = useHistory();
  const { data: studnetData, isFetching } = useFindStudentApprovalsForAdmin({ ...paidCourseQuery });

  // useEffect(() => {
  //   if (studnetData && !studnetData.empty) {
  //     const prefetchParams = {
  //       ...paidCourseQuery,
  //       offset: paidCourseState.offset * paidCourseState.limit,
  //     };
  //     preFetchFindStudentApprovalsForAdmin(queryClient, prefetchParams);
  //   }
  // }, [studnetData, queryClient]);

  const onClickMoveIndividualCourse = (studentId: string) => {
    history.push(
      `/cineroom/${patronInfo.getCineroomId()}/${learningManagementUrl}/approves/approve-management/paid-course/detail/${studentId}`
    );
  };

  const onChangeSortOrder = (_: React.SyntheticEvent, data: DropdownProps) => {
    setSortOrder(data.value as PaidCourseSortOrder);
  };

  const onChangeLimit = (_: React.SyntheticEvent, data: DropdownProps) => {
    setLimit(data.value as number);
    setOffset(0);
  };

  const onChangeOffset = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
  };

  const parsePaidCourseExcel = (approvalCube: PaidCourse, index: number) => {
    return {
      No: index + 1,
      ?????????: approvalCube.studentName ? approvalCube.studentName.ko : '-',
      email: approvalCube.email ? approvalCube.email : '-',
      '??????(Ko)': approvalCube.companyName ? approvalCube?.companyName.ko : '-',
      '??????(En)': approvalCube.companyName ? approvalCube?.companyName.en : '-',
      '??????(Zh)': approvalCube.companyName ? approvalCube?.companyName.zh : '-',
      '??????(Ko)': approvalCube.departmentName ? approvalCube?.departmentName.ko : '-',
      '??????(En)': approvalCube.departmentName ? approvalCube?.departmentName.en : '-',
      '??????(Zh)': approvalCube.departmentName ? approvalCube?.departmentName.zh : '-',
      '?????????(Ko)': approvalCube.cardName ? approvalCube.cardName.ko : '-',
      '?????????(En)': approvalCube.cardName ? approvalCube.cardName.en : '-',
      '?????????(Zh)': approvalCube.cardName ? approvalCube.cardName.zh : '-',
      ??????: approvalCube.round,
      ????????????: ApprovalCubeModel.getProposalStateName(approvalCube.proposalState),
      ????????????: approvalCube.approvedStudentCount + '/' + approvalCube.capacity,
      '(??????)????????????': approvalCube.learningStartDate + '~' + approvalCube.learningEndDate,
      ????????????: approvalCube.registeredTime && dayjs(approvalCube.registeredTime).format('YYYY.MM.DD'),
      '?????? ????????????': numeral(approvalCube.chargeAmount).format('0,0'),
      'Card ????????????': getCardCompleteNumber(approvalCube.cardId, approvalCube.denizenId),
    };
  };

  const onFindAllApprovalCubeExcel = async () => {
    const approvalCubes = await findStudentApprovalsForAdmin({
      ...paidCourseState,
      limit: 999999,
      offset: 0,
    });

    const ApprovalCubeXlxsList: ApprovalCubeXlsxModel[] = [];

    approvalCubes?.results.forEach((approvalCube, index) => {
      ApprovalCubeXlxsList.push(parsePaidCourseExcel({ ...approvalCube }, index));
    });
    const courseExcel = XLSX.utils.json_to_sheet(ApprovalCubeXlxsList);
    const temp = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(temp, courseExcel, 'ApprovalCube');
    const fileName = 'ApprovalCubes_' + dayjs().format('YYYYMMDD') + '.xlsx';
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  };
  console.log(paidCourseState);
  return (
    <>
      <SubActions>
        <SubActions.Left>
          <SubActions.Count number={studnetData?.totalCount || 0} />
        </SubActions.Left>
        <SubActions.Right>
          <Select
            className="ui small-border dropdown m0"
            value={paidCourseState.sortOrder}
            options={SelectType.sortFilterForApproval}
            onChange={onChangeSortOrder}
          />
          <Select
            className="ui small-border dropdown m0"
            defaultValue={paidCourseState.limit}
            options={SelectType.limit}
            onChange={onChangeLimit}
          />
          <SubActions.ExcelButton download onClick={onFindAllApprovalCubeExcel} />
        </SubActions.Right>
      </SubActions>
      <Dimmer.Dimmable>
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
            <col width="7%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">?????????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">email</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">??????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">??????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">?????????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">??????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">????????????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">????????????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">????????????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">(??????)????????????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">{getApprovalName(paidCourseState.proposalState)}</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">?????? ????????????</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Card ????????????</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Dimmer active={isFetching} inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
            {studnetData?.empty && (
              <Table.Row className="row">
                <Table.Cell colSpan={12}>
                  <div className="no-cont-wrap">
                    <Icon className="no-contents80" />
                    <span className="blind">????????? ??????</span>
                    <div className="text">???????????? ????????? ????????????.</div>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
            {studnetData?.results.map((card, index) => (
              <Table.Row
                className="row"
                id={card.cardId}
                key={index}
                onClick={() => card.denizenId && onClickMoveIndividualCourse(card.studentId)}
              >
                <Table.Cell textAlign="center">
                  {getItemNo(
                    studnetData.totalCount,
                    paidCourseState.offset * paidCourseState.limit,
                    index,
                    studnetData.results.length
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">{card.studentName ? card.studentName.ko : '-'}</Table.Cell>
                <Table.Cell textAlign="center">{card.email || '-'}</Table.Cell>
                <Table.Cell textAlign="center">{card.companyName ? card.companyName.ko : '-'}</Table.Cell>
                <Table.Cell textAlign="center">{card.departmentName ? card.departmentName.ko : '-'}</Table.Cell>
                <Table.Cell>{card.cardName ? card.cardName.ko : '-'}</Table.Cell>
                <Table.Cell textAlign="center">{card.round}</Table.Cell>
                <Table.Cell textAlign="center">
                  {card.approvedStudentCount}/{card.capacity}
                </Table.Cell>
                <Table.Cell textAlign="center">{getStateName(card.proposalState)}</Table.Cell>
                <Table.Cell textAlign="center">{parseLearningState(card.proposalState, card.learningState)}</Table.Cell>
                <Table.Cell textAlign="center">
                  {card.learningStartDate} ~ {card.learningEndDate}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {card.registeredTime && dayjs(card.registeredTime).format('YYYY.MM.DD')}
                </Table.Cell>
                <Table.Cell textAlign="right" style={{ display: 'table-cell' }}>
                  {numeral(card.chargeAmount).format('0,0')}
                </Table.Cell>
                <Table.Cell textAlign="right" style={{ display: 'table-cell' }}>
                  {getCardCompleteNumber(card.cardId, card.denizenId)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Dimmer.Dimmable>
      {studnetData && !studnetData.empty && (
        <div className="center">
          <Pagination
            activePage={paidCourseState.offset || 1}
            totalPages={Math.ceil((studnetData?.totalCount || 0) / paidCourseState.limit)}
            onPageChange={onChangeOffset}
          />
        </div>
      )}
    </>
  );
});
