import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { EnumUtil, UserCubeStateView } from 'shared/ui';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserCubeWithIdentity } from '../../model/sdo/UserCubeWithIdentity';
import { UserCubeState } from '../../model/vo/UserCubeState';

interface Props {
  checkAll: (isChecked: boolean) => void;
  checkOne: (index: number, userCube: UserCubeWithIdentity, value: boolean) => void;
  routeToDetail: (userCube: UserCubeWithIdentity) => void;

  userCubes: UserCubeWithIdentity[];
  selectedList: UserCubeWithIdentity[];
  startNo: number;
}

interface States {}

@observer
@reactAutobind
class CreateApprovalManagementListView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const { checkAll, checkOne, routeToDetail } = this.props;
    const { userCubes, selectedList, startNo } = this.props;

    const allSelected: boolean =
      userCubes.filter((userCube) =>
        selectedList.map((targetCube) => targetCube.userCube.id).includes(userCube.userCube.id)
      ).length === userCubes.filter((target) => target.userCube.state === UserCubeState.OpenApproval).length &&
      selectedList.length !== 0;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="3%" />
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="5%" />
          <col width="10%" />
          <col width="30%" />
          <col width="5%" />
          <col width="7%" />
          <col width="5%" />
          {/*<col width="5%" />*/}
          <col width="8%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field
                disabled={
                  userCubes.filter((target) => target.userCube.state === UserCubeState.OpenApproval).length === 0
                }
                control={Checkbox}
                checked={allSelected}
                // value={allSelected}
                onChange={() => checkAll(allSelected)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">조직</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">신청자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">신청자 E-mail</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">교육시간</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">요청일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">상태</Table.HeaderCell>
            {/*<Table.HeaderCell textAlign="center">승인자</Table.HeaderCell>*/}
            <Table.HeaderCell textAlign="center">처리일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(userCubes &&
            userCubes.length &&
            userCubes.map((userCubeWithIdentity, index) => (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  {userCubeWithIdentity.userCube.state === UserCubeState.OpenApproval ? (
                    <Form.Field
                      control={Checkbox}
                      id={userCubeWithIdentity.cube.id}
                      value={userCubeWithIdentity.cube.name}
                      checked={selectedList.some((selected) => selected.cube.id === userCubeWithIdentity.cube.id)}
                      onChange={(e: any, data: any) => checkOne(index, userCubeWithIdentity, data.value)}
                    />
                  ) : (
                    ''
                  )}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)} textAlign="center">
                  {startNo - index}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)}>
                  {getPolyglotToAnyString(userCubeWithIdentity.userIdentity.companyName)}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)}>
                  {getPolyglotToAnyString(userCubeWithIdentity.userIdentity.departmentName)}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)}>
                  {getPolyglotToAnyString(userCubeWithIdentity.userIdentity.name)}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)}>
                  {userCubeWithIdentity.userIdentity.email}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)}>
                  {getPolyglotToAnyString(userCubeWithIdentity.cube.name)}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)} textAlign="center">
                  {userCubeWithIdentity.cube.learningTime}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)} textAlign="center">
                  {moment(userCubeWithIdentity.cube.registeredTime).format('YYYY.MM.DD HH:mm:ss')}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)} textAlign="center">
                  {EnumUtil.getEnumValue(UserCubeStateView, userCubeWithIdentity.userCube.state).get(
                    userCubeWithIdentity.userCube.state
                  )}
                  {/*{userCubeWithIdentity.userCube.state}*/}
                </Table.Cell>
                {/*<Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)} textAlign="center">*/}
                {/*  {userCubeWithIdentity.userIdentity.names.langStringMap.get(*/}
                {/*    userCubeWithIdentity.userIdentity.names.defaultLanguage*/}
                {/*  )}*/}
                {/*</Table.Cell>*/}
                <Table.Cell onClick={() => routeToDetail(userCubeWithIdentity)} textAlign="center">
                  {userCubeWithIdentity.userCube.openedTime
                    ? moment(userCubeWithIdentity.userCube.openedTime).format('YYYY.MM.DD HH:mm:ss')
                    : '-'}
                </Table.Cell>
              </Table.Row>
            ))) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={12}>
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

export default CreateApprovalManagementListView;
