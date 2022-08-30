import React from 'react';
import numeral from 'numeral';
import { Table } from 'semantic-ui-react';

import { Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { ApprovalCubeWithOtherModel } from '../../model/ApprovalCubeWithOtherModel';
import { findStudentApprovalDetailForAdmin } from '_data/lecture/studentApproval/api/studentApprovalApi';
import { StudentApprovalDetail } from '_data/lecture/studentApproval/model/StudentApprovalDetail';
import { isEmpty } from 'lodash';

interface Props {
  studentId: string;
}

interface State {
  approvalData: StudentApprovalDetail;
}

class ApprovalDetailBasicInfoView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      approvalData: {} as StudentApprovalDetail,
    };
  }

  componentDidMount() {
    this.requestApprovalDetailData();
  }

  requestApprovalDetailData = async () => {
    const result = await findStudentApprovalDetailForAdmin(this.props.studentId);

    if (result !== undefined) {
      this.setState({
        approvalData: result,
      });
    }
  };

  render() {
    const { card, studentApproval, userIdentity, student, enrollmentCard, approverIdentity } = this.state.approvalData;

    if (isEmpty(this.state.approvalData)) {
      return null;
    }

    return (
      <React.Fragment>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} className="title-header">
                신청 정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">성명</Table.Cell>
              <Table.Cell>
                <span>{getPolyglotToAnyString(userIdentity.name)}</span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">조직</Table.Cell>
              <Table.Cell>
                <span>{getPolyglotToAnyString(userIdentity.departmentName)}</span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        {/*********************************************/}
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} className="title-header">
                학습정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">과정명</Table.Cell>
              <Table.Cell>
                <Polyglot.Input name="courseName" languageStrings={card.name} readOnly />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">학습유형</Table.Cell>
              <Table.Cell>
                <span>{card.type}</span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">신청한 차수</Table.Cell>
              <Table.Cell>
                <span>{enrollmentCard.round}</span>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">(차수) 교육기간</Table.Cell>
              <Table.Cell>
                <span>
                  {enrollmentCard.learningPeriod.startDate} ~ {enrollmentCard.learningPeriod.endDate}
                </span>
              </Table.Cell>
            </Table.Row>
            {/* <Table.Row>
              <Table.Cell className="tb-header">강의장소</Table.Cell>
              <Table.Cell>
                <span>{classroom.operation.location ? classroom.operation.location : '-'}</span>
              </Table.Cell>
            </Table.Row> */}
            <Table.Row>
              <Table.Cell className="tb-header">인당교육금액</Table.Cell>
              <Table.Cell>
                <span>{numeral(enrollmentCard.chargeAmount).format('0,0')}</span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        {/*********************************************/}
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} className="title-header">
                결제 승인 정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">결제 상태</Table.Cell>
              <Table.Cell>
                {student.proposalState === 'Submitted' && <span>승인요청</span>}
                {student.proposalState === 'Canceled' && <span>취소</span>}
                {student.proposalState === 'Rejected' && <span>반려</span>}
                {student.proposalState === 'Approved' && <span>승인</span>}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">승인자 정보</Table.Cell>
              <Table.Cell>
                {approverIdentity !== undefined
                  ? `${getPolyglotToAnyString(approverIdentity.name)} (${
                      approverIdentity.email
                    } | ${getPolyglotToAnyString(approverIdentity.departmentName)})`
                  : '-'}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">승인자 의견</Table.Cell>
              <Table.Cell>{studentApproval?.remark ? studentApproval.remark : '-'}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

export default ApprovalDetailBasicInfoView;
