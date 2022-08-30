import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { FormTable, RejectEmailModal } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { MemberModel } from '_data/approval/members/model';

import { UserCubeState } from '../../model/vo/UserCubeState';
import { CubeDetail } from '../../model/sdo/CubeDetail';
import { UserCubeModel } from '../../model/UserCubeModel';

interface Props {
  onClickApproveCube: () => void;
  onClickRejectCube: () => void;
  onChangeCubeRequestProps: (name: string, value: string) => void;
  findMember: () => void;

  cubeDetail: CubeDetail;
  userCube: UserCubeModel;
  readonly?: boolean;
  member: MemberModel;
}

interface States {}

@observer
@reactAutobind
class CreateApproveInfoView extends ReactComponent<Props, States> {
  //
  checkReject() {
    if (this.props.userCube.state !== UserCubeState.Rejected) {
      this.props.findMember();
      return true;
    } else {
      return false;
    }
  }

  render() {
    //
    const { onClickRejectCube, onChangeCubeRequestProps, onClickApproveCube } = this.props;
    const { cubeDetail, userCube, readonly, member } = this.props;

    return (
      <FormTable title="생성 정보">
        <FormTable.Row name="생성자 및 일시">
          <span>{getPolyglotToAnyString(cubeDetail.cubeContents.registrantName)}</span>
          <span>| {moment(cubeDetail.cube.registeredTime).format('YYYY.MM.DD HH:mm:ss')}</span>
        </FormTable.Row>
        {!readonly && userCube.state === UserCubeState.OpenApproval ? (
          <FormTable.Row name="처리상태">
            승인 요청&nbsp;&nbsp;
            <RejectEmailModal
              onShow={this.checkReject}
              onClickReject={onClickRejectCube}
              onChangeRemark={onChangeCubeRequestProps}
              emailList={[member.email]}
              nameList={[getPolyglotToAnyString(member.name)]}
              cubeTitles={[getPolyglotToAnyString(cubeDetail.cube.name)]}
              type={SelectType.mailOptions[6].value}
              buttonText="반려"
              isApprovalRoleOwner
            />
            <Button primary onClick={onClickApproveCube}>
              승인
            </Button>
          </FormTable.Row>
        ) : null}
        {(userCube.openRequests &&
          userCube.openRequests.length > 0 &&
          userCube.openRequests
            // .filter((target) => target.response)
            .map((openRequest, index) => (
              <React.Fragment key={index}>
                {userCube.state === UserCubeState.OpenApproval ? null : (
                  <Table.Row key={index}>
                    <Table.Cell className="tb-header">처리자 및 처리일자</Table.Cell>
                    <Table.Cell>
                      {getPolyglotToAnyString(userCube.approverName)} | {userCube.getApprovalDate}
                    </Table.Cell>
                  </Table.Row>
                )}
                <Table.Row key={'accepted' + index}>
                  <Table.Cell className="tb-header">처리상태</Table.Cell>
                  <Table.Cell>
                    <span>
                      {(openRequest.response &&
                        openRequest.response.time !== 0 &&
                        (openRequest.response.accepted ? '승인' : '반려')) ||
                        '승인요청'}
                    </span>
                    <span>&nbsp;&nbsp;</span>
                  </Table.Cell>
                </Table.Row>
                {openRequest && openRequest.response && openRequest.response.remark ? (
                  <Table.Row key={'reject' + index}>
                    <Table.Cell>반려 사유</Table.Cell>
                    <Table.Cell>{openRequest && openRequest.response && openRequest.response.remark}</Table.Cell>
                  </Table.Row>
                ) : null}
              </React.Fragment>
            ))) ||
          null}
      </FormTable>
    );
  }
}
export default CreateApproveInfoView;
