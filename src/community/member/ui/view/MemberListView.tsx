import React from 'react';
import { Button, Container, Grid, Pagination, Select, Table, Icon, Form, Checkbox } from 'semantic-ui-react';
import moment from 'moment';

import { reactConfirm } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { NaOffsetElementList, SelectType } from 'shared/model';
import { SearchBox, AlertWin } from 'shared/ui';

import CommunityStore from 'community/community/mobx/CommunityStore';
import MemberStore from 'community/member/mobx/MemberStore';

import { MemberQueryModel } from '../../model/MemberQueryModel';

import Member, { CommunityMemberApprovedType } from '../../model/Member';
import CommunityMemberRejctModal from './CommunityMemberRejectModal';

interface MemberListViewProps {
  searchQuery: () => void;
  memberQueryModel: MemberQueryModel;
  routeToMemberCreate: () => void;
  changeMemberQueryProps: (name: string, value: any) => void;
  clearMemberQuery: () => void;
  memberList: NaOffsetElementList<Member>;
  routeToMemberDetail: (memberId: string) => void;
  routeToMemberList: (groupMemberId: string) => void;
  sharedService: SharedService;
  // Master 변경된 state CardType
  state: CommunityMemberApprovedType | null;
  updateMembers: (communityId: string, memberIdList: (string | undefined)[], confirmType: string) => void;
  // Master 추가 된 Props
  rejectMembers: (communityId: string, memberIdList: (string | undefined)[], remark: string) => void;
  groupId: string;
  createGroupMembers: (communityId: string, groupId: string, memberIdList: (string | undefined)[]) => void;
  updateMemberType: (communityId: string, memberIdList: (string | undefined)[], memberType: string) => void;
}

const MemberListView: React.FC<MemberListViewProps> = function MemberListView({
  searchQuery,
  memberQueryModel,
  changeMemberQueryProps,
  clearMemberQuery,
  memberList,
  sharedService,
  state,
  updateMembers,
  // Master 추가된 props
  rejectMembers,
  updateMemberType,
}) {
  //const [openModal, setModalOpen] = React.useState<boolean>(false);

  // Master 추가된 var
  const message = '';
  //
  const totalCount = memberList.totalCount;
  const pageIndex = memberQueryModel.pageIndex;

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

  // Master 추가
  const [openModal, setModalWin] = React.useState<{
    rejectModalWin: boolean;
  }>({
    rejectModalWin: false,
  });

  const [selectAll, setSelectAll] = React.useState<string>('No');
  /*eslint-disable */
  const [selectedList, setSelectedList] = React.useState<(string | undefined)[]>([]);
  /*eslint-enable */
  const [memberType, setMemberType] = React.useState<string>('MEMBER');

  const memberOptions = [
    { text: '멤버', value: 'MEMBER' },
    { text: '관리자', value: 'ADMIN' },
  ];

  // Master 추가된 Funciton
  const handleClose = () => {
    setModalWin({
      rejectModalWin: false,
    });
  };
  const handleOk = React.useCallback(
    async (remark: string) => {
      reactConfirm({
        title: '확인',
        message:
          '선택한 학습자를 가입 반려 처리하시겠습니까?  입력된 반려 사유는 E-mail과 알림을 통해 전달되며, 등록된 내용은 수정하실 수 없습니다.',
        onOk: async () => {
          rejectMembers(memberQueryModel.communityId, selectedList, remark);
          handleClose();
          setSelectedList([]);
        },
      });
    },
    [memberQueryModel.communityId, selectedList]
  );

  function checkAll(checkAll: string) {
    //
    const isChecked = checkAll === 'Yes';
    if (isChecked) {
      setSelectedList([]);
      setSelectAll('No');
    } else {
      setSelectedList(memberList.results.map((member) => member.memberId));
      MemberStore.instance.setSelectedMemeberList(memberList.results.map((member) => member.memberId));
      setSelectAll('Yes');
    }

    // console.log('selectedList', selectedList);
    // console.log('selectAll', selectAll);
  }

  function checkOne(memberId: string) {
    //
    // const id = approverId;

    const copiedSelectedList: (string | undefined)[] = [...selectedList];
    const index = copiedSelectedList.indexOf(memberId);
    if (index >= 0) {
      const newSelectedList = copiedSelectedList.slice(0, index).concat(copiedSelectedList.slice(index + 1));
      setSelectedList(newSelectedList);
      MemberStore.instance.setSelectedMemeberList(newSelectedList);
    } else {
      copiedSelectedList.push(memberId);
      setSelectedList(copiedSelectedList);
      MemberStore.instance.setSelectedMemeberList(copiedSelectedList);
    }
    //console.log('selectedList', selectedList);
  }

  function handleCloseAlertWin() {
    setAlertWin({ ...alertWin, alertWinOpen: false });
  }

  function handleAlertOk(type: string) {
    if (type === 'justOk') handleCloseAlertWin();
    if (type === 'remove') {
      updateMembers(memberQueryModel.communityId, selectedList, 'remove');
      setSelectedList([]);
      handleCloseAlertWin();
    }

    // Master 추가 항목
    if (type === 'modify') {
      updateMembers(memberQueryModel.communityId, selectedList, 'modify');
      setSelectedList([]);
      handleCloseAlertWin();
    }
    if (type === 'reject') {
      // updateMembers(
      //   memberQueryModel.communityId,
      //   selectedList,
      //   'reject'
      // );
      // setSelectedList([]);
    }
  }

  // Master 추가 함수
  function handleAlertRejectedWin() {
    if (selectedList.length === 0) {
      setAlertWin({
        alertWinOpen: true,
        alertMessage: '가입반려 대상자를 선택하세요',
        alertTitle: '안내',
        alertIcon: 'circle',
        alertType: '안내',
      });
    } else {
      setModalWin({
        rejectModalWin: true,
      });
    }
  }

  function handleChangeMemberType() {
    if (selectedList.length === 0) {
      setAlertWin({
        alertWinOpen: true,
        alertMessage: '등급변경 대상자를 선택하세요',
        alertTitle: '안내',
        alertIcon: 'circle',
        alertType: '안내',
      });
    } else if (selectedList?.includes(CommunityStore.instance.selectedCommunityCdo.managerId)) {
      setAlertWin({
        alertWinOpen: true,
        alertMessage: '대표관리자는 등급을 변경할 수 없습니다.',
        alertTitle: '안내',
        alertIcon: 'circle',
        alertType: '안내',
      });
    } else {
      let memberTypeText = '';

      if (memberType === 'ADMIN') {
        memberTypeText = '관리자';
      } else {
        memberTypeText = '멤버';
      }

      reactConfirm({
        title: '알림',
        message: '선택한 멤버를 ' + memberTypeText + '로 변경하시겠습니까?',
        onOk: async () => {
          updateMemberType(memberQueryModel.communityId, selectedList, memberType);
        },
      });
    }
  }

  return (
    <Container fluid>
      <SearchBox
        onSearch={searchQuery}
        onChangeQueryProps={changeMemberQueryProps}
        onClearQueryProps={clearMemberQuery}
        queryModel={memberQueryModel}
        searchWordOption={SelectType.searchWordForMember}
        collegeAndChannel={false}
        defaultPeriod={2}
      />
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              전체 <strong>{memberList.totalCount}</strong>명 멤버 등록
            </span>
            <Select
              className="ui small-border dropdown m0"
              defaultValue={SelectType.limit[0].value}
              control={Select}
              options={SelectType.limit}
              onChange={(e: any, data: any) => changeMemberQueryProps('limit', data.value)}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              {state === 'APPROVED' && (
                <>
                  <span>선택한 멤버를</span>
                  <Select
                    className="ui small-border admin_table_select"
                    defaultValue={memberOptions[0].value}
                    options={memberOptions}
                    style={{ marginLeft: '5px' }}
                    onChange={(e: any, data: any) => setMemberType(data.value)}
                  />
                  <Button onClick={handleChangeMemberType}>
                    <Icon name="file excel outline" />
                    등급변경
                  </Button>
                </>
              )}

              {state !== 'APPROVED' && (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      if (selectedList.length > 0) {
                        setAlertWin({
                          alertMessage: '선택한 학습자를 가입 승인 하시겠습니까?',
                          alertWinOpen: true,
                          alertTitle: '확인',
                          alertIcon: 'circle',
                          alertType: 'modify',
                        });
                      }
                    }}
                  >
                    <Icon name="file excel outline" />
                    가입승인
                  </Button>
                  <Button type="button" onClick={handleAlertRejectedWin}>
                    <Icon name="file excel outline" />
                    가입반려
                  </Button>
                  {/* 반려 확인 모달 */}
                  <CommunityMemberRejctModal
                    open={openModal.rejectModalWin}
                    handleClose={handleClose}
                    handleOk={handleOk}
                  />
                </>
              )}

              <>
                <Button
                  type="button"
                  onClick={() => {
                    if (selectedList?.includes(CommunityStore.instance.selectedCommunityCdo.managerId)) {
                      setAlertWin({
                        alertMessage: '커뮤니티 관리자는 삭제할 수 없습니다.',
                        alertWinOpen: true,
                        alertTitle: '관리자 삭제 불가 안내 ',
                        alertIcon: 'triangle',
                        alertType: 'justOk',
                      });
                    } else {
                      setAlertWin({
                        alertMessage: '멤버를 삭제하시겠습니까?',
                        alertWinOpen: true,
                        alertTitle: '멤버 삭제 안내',
                        alertIcon: 'triangle',
                        alertType: 'remove',
                      });
                    }
                  }}
                >
                  <Icon name="file excel outline" />
                  멤버삭제
                </Button>
              </>
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
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field
                control={Checkbox}
                checked={selectedList.length > 0 && selectedList.length === memberList.results.length}
                value={selectAll}
                onChange={(e: any, data: any) => checkAll(data.value)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            {/* <Table.HeaderCell textAlign="center">memberId</Table.HeaderCell> */}
            <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">닉네임</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등급</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {memberList && memberList.results.length ? (
            memberList.results.map((member, index) => {
              return (
                <Table.Row
                  key={index}
                  // onClick={() => routeToMemberDetail(member.memberId || '')}
                >
                  <Table.Cell textAlign="center">
                    <Form.Field
                      control={Checkbox}
                      value={member.memberId}
                      checked={selectedList?.includes(member.memberId)}
                      onChange={(e: any, data: any) => checkOne(data.value)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                  {/* <Table.Cell textAlign="center">{member.memberId}</Table.Cell> */}
                  <Table.Cell textAlign="center">{member.companyName}</Table.Cell>
                  <Table.Cell textAlign="center">{member.teamName}</Table.Cell>
                  <Table.Cell textAlign="center">{member.name}</Table.Cell>
                  <Table.Cell textAlign="center">{member.nickname}</Table.Cell>
                  <Table.Cell textAlign="center">{member.email}</Table.Cell>
                  <Table.Cell textAlign="center">{moment(member.createdTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {CommunityStore.instance.selectedCommunityCdo.managerId === member.memberId
                      ? '대표관리자'
                      : member.memberType === 'ADMIN'
                      ? '관리자'
                      : '멤버'}
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
                    activePage={pageMap.get('member') ? pageMap.get('member').page : 1}
                    totalPages={pageMap.get('member') ? pageMap.get('member').totalPages : 1}
                    onPageChange={(e, data) => {
                      changeMemberQueryProps('page', data.activePage);
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
  );
};

export default MemberListView;
