import * as React from 'react';
import { Button, Table, Form, Container } from 'semantic-ui-react';
import { AlertWin, ConfirmWin } from 'shared/ui';
import GroupMemberListContainer from '../../../groupMember/ui/logic/GroupMemberListContainer';
import GroupCdoModel from '../../model/GroupCdoModel';
import { existsByCommunityIdAndName } from '../../api/GroupApi';

interface CreateGroupBasicInfoViewProps {
  routeToGroupList: () => void;
  saveGroup: () => void;
  changeGroupCdoProps: (name: string, value: any) => void;
  groupCdo?: GroupCdoModel;
  deleteGroup: () => void;
}

const fileInputRef = React.createRef<HTMLInputElement>();
const message = <p className="center">입력하신 게시물을 저장 하시겠습니까?</p>;
const CreateGroupBasicInfoView: React.FC<CreateGroupBasicInfoViewProps> = function CreateGroupBasicInfoView(props) {
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

  /*eslint-disable */
  const [confirmWin, setConfirmWin] = React.useState<{
    confirmWinOpen: boolean;
    handleOk: () => void;
  }>({
    confirmWinOpen: false,
    handleOk: updateHandleOKConfirmWin,
  });
  /*eslint-enable */

  function handleDelete() {
    if (props.groupCdo && props.groupCdo.groupId) {
      // setConfirmWin({
      //   confirmWinOpen: true,
      //   handleOk: deleteHandleOKConfirmWin,
      // });

      setAlertWin({
        alertMessage: '삭제 하시겠습니까?',
        alertWinOpen: true,
        alertTitle: '삭제 안내',
        alertIcon: 'circle',
        alertType: 'remove',
      });
    }
  }

  function handleSave() {
    if (!props.groupCdo) {
      return;
    }

    const groupObject = GroupCdoModel.isBlank(props.groupCdo);

    const groupMessage = '"' + groupObject + '" 은 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';

    if (!props.groupCdo.groupId) {
      existsByCommunityIdAndName(encodeURI(props.groupCdo.communityId), encodeURI(props.groupCdo.name)).then(
        (response) => {
          if (response) {
            setAlertWin({
              alertMessage: '그룹명이 중복되었습니다.',
              alertWinOpen: true,
              alertTitle: '그룹명 중복 안내',
              alertIcon: 'triangle',
              alertType: 'justOk',
            });
          } else {
            if (groupObject === 'success') {
              if (!props.groupCdo?.groupId) {
                setConfirmWin({
                  confirmWinOpen: true,
                  handleOk: updateHandleOKConfirmWin,
                });
                return;
              }
              setAlertWin({
                alertMessage: '저장 하시겠습니까?',
                alertWinOpen: true,
                alertTitle: '저장 안내',
                alertIcon: 'circle',
                alertType: 'save',
              });
            } else if (groupObject !== 'success') confirmBlank(groupMessage);
          }
        }
      );
    } else {
      if (groupObject === 'success') {
        if (!props.groupCdo?.groupId) {
          setConfirmWin({
            confirmWinOpen: true,
            handleOk: updateHandleOKConfirmWin,
          });
          return;
        }
        setAlertWin({
          alertMessage: '저장 하시겠습니까?',
          alertWinOpen: true,
          alertTitle: '저장 안내',
          alertIcon: 'circle',
          alertType: 'save',
        });
      } else if (groupObject !== 'success') confirmBlank(groupMessage);
    }
  }

  function handleCloseConfirmWin() {
    setConfirmWin({ ...confirmWin, confirmWinOpen: false });
  }

  function handleCloseAlertWin() {
    setAlertWin({ ...alertWin, alertWinOpen: false });
  }

  function confirmBlank(message: string) {
    //
    setAlertWin({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '필수 정보 입력 안내',
      alertIcon: 'triangle',
      alertType: 'justOk',
    });
  }
  // 삭제
  async function deleteHandleOKConfirmWin() {
    await props.deleteGroup();
    props.routeToGroupList();
  }

  // 저장
  async function updateHandleOKConfirmWin() {
    await props.saveGroup();
    props.routeToGroupList();
  }

  function handleAlertOk(type: string) {
    if (type === 'justOk') handleCloseAlertWin();
    if (type === 'remove') deleteHandleOKConfirmWin();
    if (type === 'save') updateHandleOKConfirmWin();
  }

  // function onModifyBanner() {
  //   //
  //   if (!props.groupCdo) {
  //     return;
  //   }
  //   const groupObject = GroupCdoModel.isBlank(props.groupCdo);

  //   if (groupObject === 'success') {
  //     setConfirmWin({ confirmWinOpen: true,handleOk:updateHandleOKConfirmWin});
  //   }
  // }

  return (
    <>
      <Container fluid>
        <Form>
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={2}>그룹 정보</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell className="tb-header">
                  그룹명 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Field>
                    <div>
                      <input
                        id="groupName"
                        type="text"
                        placeholder="그룹명을 입력해주세요."
                        value={props.groupCdo?.name}
                        onChange={(e: any) => props.changeGroupCdoProps('name', e.target.value)}
                      />
                    </div>
                  </Form.Field>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">
                  그룹설명 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Field>
                    <div>
                      <input
                        id="groupDescription"
                        type="text"
                        placeholder="그룹설명을 입력해주세요."
                        value={props.groupCdo?.introduce}
                        onChange={(e: any) => props.changeGroupCdoProps('introduce', e.target.value)}
                      />
                    </div>
                  </Form.Field>
                </Table.Cell>
              </Table.Row>

              {props.groupCdo?.groupId !== '' ? (
                <Table.Row>
                  <Table.Cell className="tb-header">그룹장</Table.Cell>
                  <Table.Cell>
                    <Form.Field>
                      <div>
                        <input
                          id="groupManagerName"
                          type="text"
                          placeholder="그룹장을 선택해주세요."
                          value={props.groupCdo?.managerName}
                          disabled={true}
                        />
                      </div>
                    </Form.Field>
                  </Table.Cell>
                </Table.Row>
              ) : null}
            </Table.Body>
          </Table>
          <div className="btn-group">
            {props.groupCdo?.groupId !== '' ? (
              <Button onClick={handleDelete} type="button">
                삭제
              </Button>
            ) : null}
            <div className="fl-right">
              <Button basic onClick={props.routeToGroupList} type="button">
                목록
              </Button>
              <Button primary onClick={handleSave} type="button">
                저장
              </Button>
            </div>
          </div>
        </Form>
        <AlertWin
          message={alertWin.alertMessage}
          handleClose={handleCloseAlertWin}
          open={alertWin.alertWinOpen}
          alertIcon={alertWin.alertIcon}
          title={alertWin.alertTitle}
          type={alertWin.alertType}
          handleOk={handleAlertOk}
        />
        <ConfirmWin
          message="저장하시겠습니까?"
          open={confirmWin.confirmWinOpen}
          handleClose={handleCloseConfirmWin}
          handleOk={updateHandleOKConfirmWin}
          title="저장 안내"
          buttonYesName="저장"
          buttonNoName="취소"
        />
      </Container>
      <GroupMemberListContainer communityId={props.groupCdo && props.groupCdo.communityId} />
    </>
  );
};

export default CreateGroupBasicInfoView;
