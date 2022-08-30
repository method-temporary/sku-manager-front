import * as React from 'react';
import { Form, Button, Header, Segment } from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import { MemberViewModel } from '@nara.drama/approval';
import { ConfirmWin } from 'shared/ui';
import BoardCdoModel from '../../model/BoardCdoModel';
import PostModel from '../../model/PostModel';

interface CreateBoardBasicInfoViewProps {
  title?: string;
  contents?: string;
  writer?: string;
  onChangeBoardName: (value: any, setName: any) => void;
  onChangeBoardDescription: (value: any, setDescription: any) => void;
  uploadFile: (file: File, setFileName: any, setIconBox: any) => void;
  selectField: any[];
  routeToBoardList: () => void;
  saveBoard: () => void;
  changeBoardCdoProps: (name: string, value: any) => void;
  boardCdo?: BoardCdoModel;
  //boardCdoType: string;
  confirmWinOpen: boolean;
  post: PostModel;
  handleDelete: () => void;
  routeToModifyFaq: (postId: string) => void;
  routeToPostList: () => void;
}

const fileInputRef = React.createRef<HTMLInputElement>();
const message = <p className="center">입력하신 커뮤니티를 저장 하시겠습니까?</p>;
const CreateBoardBasicInfoView: React.FC<CreateBoardBasicInfoViewProps> = function CreateBoardBasicInfoView(props) {
  const handleManagerListModalOk = React.useCallback((member: MemberViewModel) => {
    props.changeBoardCdoProps('managerId', member.id);
    props.changeBoardCdoProps('managerName', MemberViewModel.getLanguageStringByLanguage(member.names, 'ko'));
    setMember({
      email: member.email,
      names: MemberViewModel.getLanguageStringByLanguage(member.names, 'ko'),
      companyCode: member.companyCode,
    });
  }, []);
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
  const [confirmWin, setConfirmWin] = React.useState<{
    confirmWinOpen: boolean;
    isSaveAndApprove: boolean;
  }>({
    confirmWinOpen: false,
    isSaveAndApprove: false,
  });

  const [fileName, setFileName] = React.useState<string>('');
  const [iconBox, setIconBox] = React.useState();
  const [name, setName] = React.useState<string>(props.title || '');
  const [nameLength, setNameLength] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>(props.contents || '');
  const [descriptionLength, setDescriptionLength] = React.useState<number>(0);
  const [member, setMember] = React.useState({
    email: '',
    names: '',
    companyCode: '',
  });
  const [isOpend, setIsOpend] = React.useState<string>(props.writer || 'Yes');
  const [boardType, setBoardType] = React.useState<string>('open');
  const [boardField, setBoardField] = React.useState<string>('');

  const [coursePlanListModalOpen, setCoursePlanListModalOpen] = React.useState<boolean>(false);

  const [idSet, setIdSet] = React.useState<string[]>([]);
  const [courseName, setCourseName] = React.useState<string>('');

  React.useEffect(() => {
    setNameLength(name.length);
  }, [name]);

  React.useEffect(() => {
    setDescriptionLength(description.length);
  }, [description]);

  function addCourseSet(coursePlan: any) {
    setIdSet([coursePlan.coursePlanId]);
    // setName(coursePlan.name);
    props.changeBoardCdoProps('courseId', coursePlan.coursePlanId);
    props.changeBoardCdoProps('name', coursePlan.name);
  }

  function handleSave() {
    if (!props.boardCdo) {
      return;
    }

    const boardObject = BoardCdoModel.isBlank(props.boardCdo);

    const boardMessage = '"' + boardObject + '" 은 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';

    if (boardObject === 'success') {
      if (!props.boardCdo.boardId) {
        setConfirmWin({ confirmWinOpen: true, isSaveAndApprove: false });
        return;
      }

      setAlertWin({
        alertMessage: '저장 하시겠습니까?',
        alertWinOpen: true,
        alertTitle: '저장 안내',
        alertIcon: 'circle',
        alertType: 'save',
      });
    } else if (boardObject !== 'success') confirmBlank(boardMessage);
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

  // 저장
  function handleOKConfirmWin(mode?: string) {
    //todo promis then 처리 추가 예정
    props.saveBoard();
    props.routeToBoardList();
  }

  function handleAlertOk(type: string) {
    if (type === 'justOk') handleCloseAlertWin();
    //if (type === 'remove') handleDeleteCoursePlan(coursePlanId);
    if (type === 'save') handleOKConfirmWin('modify');
  }

  return (
    <>
      <Form>
        <div className="content">
          <div className="post-detail">
            <Segment.Group>
              <Segment padded>
                <Header as="h2" textAlign="left">
                  {props.post.title && props.post.title}
                </Header>
                <div className="user-info">
                  <div className="ui profile">
                    <div className="pic" />
                  </div>
                  <span className="name">{props.post.writer && props.post.writer.name}</span>
                  <span className="name">{props.post.writer && props.post.writer.email}</span>
                  <span className="date">{props.post.createdTime}</span>
                  <span className="date">&nbsp;&nbsp;{props.post.readCount && props.post.readCount} view</span>
                </div>
                <div className="post-section">
                  {(props.post.pinned && (
                    <span className="view-num">
                      &#10071;주요&nbsp;&nbsp; 게시기간: {props.post.period && props.post.period.startDateDot} ~{' '}
                      {props.post.period && props.post.period.endDateDot}
                    </span>
                  )) || <span className="name">일반</span>}
                </div>
                <div className="post-section">구분: {props.post.category && props.post.category.name}</div>
              </Segment>
              <Segment>
                <ReactQuill
                  theme="bubble"
                  value={(props.post && props.post.contents && props.post.contents.contents) || ''}
                  readOnly
                />
              </Segment>
            </Segment.Group>
          </div>
          <div className="btn-group">
            <Button onClick={props.handleDelete} type="button">
              삭제
            </Button>
            <div className="fl-right">
              <Button
                primary
                onClick={() => props.routeToModifyFaq(props.post.postId && props.post.postId)}
                type="button"
              >
                수정
              </Button>
              <Button onClick={props.routeToPostList} type="button">
                목록
              </Button>
            </div>
          </div>
          {/*<AlertWin*/}
          {/*  message={isBlankTarget}*/}
          {/*  handleClose={handleCloseAlertWin}*/}
          {/*  open={alertWinOpen}*/}
          {/*/>*/}
          <ConfirmWin
            message="삭제하시겠습니까?"
            open={props.confirmWinOpen}
            handleClose={handleCloseConfirmWin}
            handleOk={handleOKConfirmWin}
            title="삭제 안내"
            buttonYesName="삭제"
            buttonNoName="취소"
          />
        </div>
      </Form>
    </>
  );
};

export default CreateBoardBasicInfoView;
