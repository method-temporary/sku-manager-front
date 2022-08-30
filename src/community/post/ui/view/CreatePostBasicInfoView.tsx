import * as React from 'react';
import { Button, Select, Table, Form, Input, Container, Icon } from 'semantic-ui-react';
import { FileBox, PatronType } from '@nara.drama/depot';
import { AlertWin, ConfirmWin } from 'shared/ui';
import PostCdoModel from '../../model/PostCdoModel';
import Editor from '../logic/Editor';

interface CreatePostBasicInfoViewProps {
  uploadFile: (file: File, setFileName: any) => void;
  selectMenu: any[];
  routeToPostList: () => void;
  savePost: () => void;
  changePostCdoProps: (name: string, value: any) => void;
  postCdo?: PostCdoModel;
  deletePost: () => void;
}

const fileInputRef = React.createRef<HTMLInputElement>();
const message = <p className="center">입력하신 게시물을 저장 하시겠습니까?</p>;
const CreatePostBasicInfoView: React.FC<CreatePostBasicInfoViewProps> = function CreatePostBasicInfoView(props) {
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
    if (props.postCdo && props.postCdo.postId) {
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
    if (!props.postCdo) {
      return;
    }

    const postObject = PostCdoModel.isBlank(props.postCdo);

    const postMessage = '"' + postObject + '" 은 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';

    if (postObject === 'success') {
      if (!props.postCdo.postId) {
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
    } else if (postObject !== 'success') confirmBlank(postMessage);
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
  function deleteHandleOKConfirmWin() {
    //todo promis then 처리 추가 예정
    Promise.resolve()
      .then(() => props.deletePost())
      .then(() => props.routeToPostList());
  }

  // 저장
  function updateHandleOKConfirmWin() {
    //todo promis then 처리 추가 예정
    Promise.resolve()
      .then(() => props.savePost())
      .then(() => props.routeToPostList());
  }

  function handleAlertOk(type: string) {
    if (type === 'justOk') handleCloseAlertWin();
    if (type === 'remove') deleteHandleOKConfirmWin();
    if (type === 'save') updateHandleOKConfirmWin();
  }

  async function getFileBoxIdForReference(fileBoxId: string) {
    // 파일 모두 지웠을때 저장 process
    let fBoxId = fileBoxId || null;
    if (fileBoxId === undefined) {
      fBoxId = null;
    }
    props.changePostCdoProps('fileBoxId', fBoxId);
    // 순서대로 실행되어야 함.
    if (fileBoxId === undefined) {
      await handleSave();
    }
  }
  // function onModifyBanner() {
  //   //
  //   if (!props.postCdo) {
  //     return;
  //   }
  //   const postObject = PostCdoModel.isBlank(props.postCdo);

  //   if (postObject === 'success') {
  //     setConfirmWin({ confirmWinOpen: true,handleOk:updateHandleOKConfirmWin});
  //   }
  // }

  return (
    <Container fluid>
      <Form>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>

          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2}>게시물 정보</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>메뉴명</Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    control={Select}
                    placeholder="Select"
                    options={props.selectMenu}
                    value={props.postCdo?.menuId}
                    onChange={(e: any, data: any) => {
                      props.changePostCdoProps('menuId', data.value);
                    }}
                  />
                </Form.Group>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>제목</Table.Cell>
              <Table.Cell>
                <Form.Field
                  control={Input}
                  placeholder="게시물 제목을 입력해주세요."
                  value={props.postCdo?.title}
                  onChange={(e: any) => props.changePostCdoProps('title', e.target.value)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>내용</Table.Cell>
              <Table.Cell>
                <Editor
                  value={(props.postCdo && props.postCdo.html) || ''}
                  onChangeContentsProps={props.changePostCdoProps}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>첨부파일</Table.Cell>
              <Table.Cell>
                <div className="lg-attach">
                  <div className="attach-inner">
                    <FileBox
                      id={props.postCdo?.fileBoxId || ''}
                      vaultKey={{
                        keyString: 'sku-depot',
                        patronType: PatronType.Pavilion,
                      }}
                      patronKey={{
                        keyString: 'sku-denizen',
                        patronType: PatronType.Denizen,
                      }}
                      onChange={getFileBoxIdForReference}
                    />
                    <div className="bottom">
                      <span className="info-text1">
                        <Icon className="info16" />
                        <span className="blind">information</span>
                        <p>문서 및 이미지 파일을 업로드 가능합니다.</p>
                      </span>
                    </div>
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>작성자 </Table.Cell>
              <Table.Cell>
                {props.postCdo && props.postCdo.nickName === ''
                  ? props.postCdo && props.postCdo.creatorName
                  : props.postCdo && props.postCdo.nickName}{' '}
                | {props.postCdo?.createdTime && new Date(props.postCdo?.createdTime).toLocaleDateString()}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <div className="btn-group">
          <div className="fl-right">
            <Button basic onClick={handleDelete} type="button">
              삭제
            </Button>
            <Button basic onClick={props.routeToPostList} type="button">
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
  );
};

export default CreatePostBasicInfoView;
