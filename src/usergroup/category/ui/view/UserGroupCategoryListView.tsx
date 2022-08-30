import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserGroupCategoryModel } from '../../model';
import { UserGroupModel } from '../../../group/model';

interface Props {
  //
  checked: boolean;
  cineroomId: string;
  userGroupCategoryList: UserGroupCategoryModel[];
  routeToGroupCategoryDetail: (userGroupCategoryId: string) => void;
  startNo: number;
  onClickCheckAll: (value: boolean) => void;
  onClickCheckOne: (index: number, name: string, value: boolean, userGroupCategoryRdo: UserGroupCategoryModel) => void;
  userWorkspaceMap: Map<string, string>;
}

class UserGroupCategoryListView extends React.Component<Props> {
  //
  render() {
    //
    const {
      checked,
      cineroomId,
      userGroupCategoryList,
      userWorkspaceMap,
      routeToGroupCategoryDetail,
      startNo,
      onClickCheckAll,
      onClickCheckOne,
    } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="3%" />
          <col width="5%" />
          <col width="10%" />
          <col width="15%" />
          <col width="15%" />
          <col width="32%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>
              <Form.Field
                control={Checkbox}
                checked={checked}
                onChange={(event: any, data: any) => onClickCheckAll(data.checked)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>사용처</Table.HeaderCell>
            <Table.HeaderCell>사용여부</Table.HeaderCell>
            <Table.HeaderCell>사용자 그룹 분류</Table.HeaderCell>
            <Table.HeaderCell>사용자 그룹명</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>등록일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userGroupCategoryList && userGroupCategoryList.length ? (
            userGroupCategoryList.map((userGroupCategoryModel: UserGroupCategoryModel, index: number) => (
              <Table.Row
                key={userGroupCategoryModel.id}
                onClick={() => routeToGroupCategoryDetail(userGroupCategoryModel.id)}
              >
                <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
                  <Form.Field
                    disabled={userGroupCategoryModel.cineroomId !== cineroomId}
                    control={Checkbox}
                    checked={userGroupCategoryModel.checked}
                    onChange={(event: any, data: any) =>
                      onClickCheckOne(index, 'checked', data.checked, userGroupCategoryModel)
                    }
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell>
                  {userWorkspaceMap.get(userGroupCategoryModel.cineroomId) || userGroupCategoryModel.cineroomId}
                </Table.Cell>
                <Table.Cell>{userGroupCategoryModel.enabled ? '사용' : '사용중지'}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(userGroupCategoryModel.name)}</Table.Cell>
                <Table.Cell>
                  {userGroupCategoryModel.userGroups &&
                    userGroupCategoryModel.userGroups.map((userGroup: UserGroupModel, index: number) =>
                      index === 0
                        ? getPolyglotToAnyString(userGroup.name)
                        : ', ' + getPolyglotToAnyString(userGroup.name)
                    )}
                </Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(userGroupCategoryModel.registrantName)}</Table.Cell>
                <Table.Cell textAlign="center">
                  {moment(userGroupCategoryModel.registeredTime).format(`YYYY.MM.DD`)}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={9}>
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

export default UserGroupCategoryListView;
