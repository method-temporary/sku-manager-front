import React from 'react';
import { Button, Container, Grid, Pagination, Select, Table, Icon, Form, Checkbox, Modal } from 'semantic-ui-react';
import moment from 'moment';

import { NaOffsetElementList, SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { SearchBox, AlertWin } from 'shared/ui';

import GroupStore from 'community/group/mobx/GroupStore';
import MemberStore from 'community/member/mobx/MemberStore';

import GroupMember from '../../model/GroupMember';
import { GroupMemberQueryModel } from '../../model/GroupMemberQueryModel';
import MemberListContainer from '../../../member/ui/logic/MemberListContainer';

interface GroupMemberListViewProps {
  searchQuery: () => void;
  groupMemberQueryModel: GroupMemberQueryModel;
  changeGroupMemberQueryProps: (name: string, value: any) => void;
  clearGroupMemberQuery: () => void;
  groupMemberList: NaOffsetElementList<GroupMember>;
  routeToMemberList: (groupId: string) => void;
  sharedService: SharedService;
  createGroupMembers: (communityId: string, groupId: string, groupMemberIdList: (string | undefined)[]) => void;
  updateGroupMembers: (
    communityId: string,
    groupId: string,
    groupMemberIdList: (string | undefined)[],
    confirmType: string
  ) => void;
  updateGroupMemberAdmin: (communityId: string, groupId: string, groupMemberId: string) => void;
  findGroupInfoById: (communityId: string, groupId: string) => void;
}

const GroupMemberListView: React.FC<GroupMemberListViewProps> = function GroupMemberListView({
  searchQuery,
  groupMemberQueryModel,
  changeGroupMemberQueryProps,
  clearGroupMemberQuery,
  groupMemberList,
  routeToMemberList,
  sharedService,
  createGroupMembers,
  updateGroupMembers,
  updateGroupMemberAdmin,
  findGroupInfoById,
}) {
  const totalCount = groupMemberList.totalCount;
  const pageIndex = groupMemberQueryModel.pageIndex;

  const { pageMap } = sharedService || ({} as SharedService);

  const [alertWin, setAlertWin] = React.useState<{
    alertMessage: string;
    alertWinOpen: boolean;
    alertTitle: string;
    alertIcon: string;
    alertType: string;
  }>({
    alertMessage: '저장 하시겠습니까?',
    alertWinOpen: false,
    alertTitle: '저장 안내',
    alertIcon: 'circle',
    alertType: 'save',
  });

  const [open, setOpen] = React.useState<boolean>(false);
  const [selectAll, setSelectAll] = React.useState<string>('No');
  /*eslint-disable */
  const [selectedList, setSelectedList] = React.useState<(string | undefined)[]>([]);
  /*eslint-enable */
  function checkAll(checkAll: string) {
    //
    const isChecked = checkAll === 'Yes';
    if (isChecked) {
      setSelectedList([]);
      setSelectAll('No');
    } else {
      setSelectedList(groupMemberList.results.map((groupMember) => groupMember.memberId));
      setSelectAll('Yes');
    }

    // console.log('selectedList', selectedList);
    // console.log('selectAll', selectAll);
  }

  function checkOne(groupMemberId: string) {
    //
    // const id = approverId;

    const copiedSelectedList: (string | undefined)[] = [...selectedList];
    const index = copiedSelectedList.indexOf(groupMemberId);
    if (index >= 0) {
      const newSelectedList = copiedSelectedList.slice(0, index).concat(copiedSelectedList.slice(index + 1));
      setSelectedList(newSelectedList);
    } else {
      copiedSelectedList.push(groupMemberId);
      setSelectedList(copiedSelectedList);
    }
    //console.log('selectedList', selectedList);
  }

  function handleCloseAlertWin() {
    setAlertWin({ ...alertWin, alertWinOpen: false });
  }

  function handleDelete() {
    if (selectedList?.includes(GroupStore.instance.selectedGroupCdo.managerId)) {
      setAlertWin({
        alertMessage: '그룹장은 삭제할 수 없습니다.',
        alertWinOpen: true,
        alertTitle: '그룹장 삭제 불가 안내',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else {
      setAlertWin({
        alertMessage: '그룹 멤버를 삭제하시겠습니까?',
        alertWinOpen: true,
        alertTitle: '그룹멤버 삭제 안내',
        alertIcon: 'triangle',
        alertType: 'remove',
      });
    }
  }

  function handleSave() {
    if (selectedList.length == 1) {
      setAlertWin({
        alertMessage: '그룹장을 지정했습니다.',
        alertWinOpen: true,
        alertTitle: '그룹장 지정 안내',
        alertIcon: 'triangle',
        alertType: 'save',
      });
    } else if (selectedList.length == 0) {
      setAlertWin({
        alertMessage: '그룹장으로 지정할 멤버를 선택해주세요.',
        alertWinOpen: true,
        alertTitle: '그룹장 멤버 선택 안내',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else {
      setAlertWin({
        alertMessage: '그룹장은 한 명만 선택해주세요.',
        alertWinOpen: true,
        alertTitle: '그룹장 다중 선택 불가 안내',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    }
  }

  // 그룹멤버 삭제
  function deleteHandleOKConfirmWin() {
    updateGroupMembers(groupMemberQueryModel.communityId, groupMemberQueryModel.groupId, selectedList, 'remove');
    setSelectedList([]);
    handleCloseAlertWin();
  }

  // 그룹장지정
  function updateHandleOKConfirmWin() {
    updateGroupMemberAdmin(groupMemberQueryModel.communityId, groupMemberQueryModel.groupId, selectedList[0] || '');
    setSelectedList([]);
    findGroupInfoById(groupMemberQueryModel.communityId, groupMemberQueryModel.groupId);
    GroupStore.instance.clearGroupCdo();
    routeToMemberList(groupMemberQueryModel.groupId);
    handleCloseAlertWin();
  }

  function handleAlertOk(type: string) {
    if (type === 'justOk') handleCloseAlertWin();
    if (type === 'remove') deleteHandleOKConfirmWin();
    if (type === 'save') updateHandleOKConfirmWin();
  }

  return (
    <>
      {groupMemberQueryModel.groupId !== undefined ? (
        <Container fluid>
          <SearchBox
            onSearch={searchQuery}
            onChangeQueryProps={changeGroupMemberQueryProps}
            onClearQueryProps={clearGroupMemberQuery}
            queryModel={groupMemberQueryModel}
            searchWordOption={SelectType.searchWordForMember}
            collegeAndChannel={false}
            defaultPeriod={2}
          />
          <Grid className="list-info">
            <Grid.Row>
              <Grid.Column width={8}>
                <span>
                  전체 <strong>{groupMemberList.totalCount}</strong>명 멤버 등록
                </span>
              </Grid.Column>
              <Grid.Column width={8}>
                <div className="right">
                  <Select
                    className="ui small-border dropdown m0"
                    defaultValue={SelectType.limit[0].value}
                    control={Select}
                    options={SelectType.limit}
                    onChange={(e: any, data: any) => changeGroupMemberQueryProps('limit', data.value)}
                  />
                  <Button type="button" onClick={handleSave}>
                    그룹장 지정
                  </Button>
                  <>
                    <Button onClick={() => setOpen(true)}>그룹 멤버 추가</Button>
                    <React.Fragment>
                      <Modal open={open} size="large">
                        <Modal.Header className="res">
                          추가 멤버 선택
                          <span className="sub f12">추가 멤버를 선택해주세요.</span>
                        </Modal.Header>

                        <Modal.Content className="fit-layout">
                          <MemberListContainer
                            communityId={groupMemberQueryModel.communityId}
                            state="APPROVED"
                            groupId={groupMemberQueryModel.groupId}
                          />
                        </Modal.Content>
                        <Modal.Actions>
                          <Button className="w190 d" onClick={() => setOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            className="w190 p"
                            type="button"
                            onClick={() => {
                              const selectedMemberList = MemberStore.instance.selectedMemberList;

                              createGroupMembers(
                                groupMemberQueryModel.communityId,
                                groupMemberQueryModel.groupId,
                                selectedMemberList
                              );
                              setSelectedList([]);
                              searchQuery();
                              routeToMemberList(groupMemberQueryModel.groupId);
                            }}
                          >
                            OK
                          </Button>
                        </Modal.Actions>
                      </Modal>
                    </React.Fragment>
                  </>
                  <Button type="button" onClick={handleDelete}>
                    그룹 멤버 삭제
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Table celled selectable>
            <colgroup>
              <col width="3%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="7%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">
                  <Form.Field
                    control={Checkbox}
                    checked={selectedList.length > 0 && selectedList.length === groupMemberList.results.length}
                    value={selectAll}
                    onChange={(e: any, data: any) => checkAll(data.value)}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">닉네임</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {groupMemberList && groupMemberList.results.length ? (
                groupMemberList.results.map((groupMember, index) => {
                  return (
                    <Table.Row
                      key={index}
                      // onClick={() => routeToGroupMemberDetail(groupMember.groupMemberId || '')}
                    >
                      <Table.Cell textAlign="center">
                        <Form.Field
                          control={Checkbox}
                          value={groupMember.memberId}
                          checked={selectedList?.includes(groupMember.memberId)}
                          onChange={(e: any, data: any) => checkOne(data.value)}
                        />
                      </Table.Cell>
                      <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                      <Table.Cell textAlign="center">{groupMember.companyName}</Table.Cell>
                      <Table.Cell textAlign="center">{groupMember.teamName}</Table.Cell>
                      <Table.Cell textAlign="center">{groupMember.name}</Table.Cell>
                      <Table.Cell textAlign="center">{groupMember.nickname}</Table.Cell>
                      <Table.Cell textAlign="center">{groupMember.email}</Table.Cell>
                      <Table.Cell textAlign="center">
                        {moment(groupMember.createdTime).format('YYYY.MM.DD HH:mm:ss')}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={8}>
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
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                {totalCount === 0 ? null : (
                  <>
                    <div className="center">
                      <Pagination
                        activePage={pageMap.get('groupMember') ? pageMap.get('groupMember').page : 1}
                        totalPages={pageMap.get('groupMember') ? pageMap.get('groupMember').totalPages : 1}
                        onPageChange={(e, data) => {
                          changeGroupMemberQueryProps('page', data.activePage);
                          searchQuery();
                        }}
                      />
                    </div>
                  </>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <AlertWin
            message={alertWin.alertMessage}
            handleClose={handleCloseAlertWin}
            open={alertWin.alertWinOpen}
            alertIcon={alertWin.alertIcon}
            title={alertWin.alertTitle}
            type={alertWin.alertType}
            handleOk={handleAlertOk}
          />
        </Container>
      ) : null}
    </>
  );
};

export default GroupMemberListView;
