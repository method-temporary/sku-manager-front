import React, { useCallback, useRef } from 'react';
import { Button, Table, Form, Select, Image } from 'semantic-ui-react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import { AlertWin, HtmlEditor } from 'shared/ui';

import Home from 'community/home/model/Home';
import {
  ChangeType,
  ChangeIntroduce,
  SetThumbnailId,
  ChangeHtml,
  changeCommunityHomeColor,
} from '../../service/useHome';
import HomeType from '../../model/HomeType';

interface CommunityHomeViewProps {
  type?: HomeType;
  introduce?: string;
  thumbnailId?: string;
  html?: string;
  changeType: ChangeType;
  changeIntroduce: ChangeIntroduce;
  setThumbnailId: SetThumbnailId;
  changeHtml: ChangeHtml;
  save: () => void;
  previewSave: () => void;
  homeInfo?: Home;
  color?: string;
}
const homeTypes = [
  { key: 'BASIC', text: '기본', value: 'BASIC' },
  { key: 'HTML', text: 'HTML', value: 'HTML' },
];
const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'trike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

interface Params {
  cineroomId: string;
  communityId: string;
  draft: string;
}

const CommunityHomeView: React.FC<CommunityHomeViewProps> = function CommunityHomeView({
  type,
  introduce,
  thumbnailId = null,
  html,
  changeType,
  changeIntroduce,
  setThumbnailId,
  changeHtml,
  save,
  previewSave,
  homeInfo,
  color,
}) {
  const history = useHistory();
  const { params } = useRouteMatch<Params>();
  const routeToCommunityList = useCallback(() => {
    history.push(`/cineroom/${params.cineroomId}/community-management/community/community-list`);
  }, [history, params]);

  const routeToPreviewPop = useCallback(() => {
    //미리보기 기능 이용시 local 테스트가 아닌 http://ma.mysuni.sk.com/ or http://university.sk.com/ 테스트 필요
    //미리보기시 user-front의 페이지를 호출하여 새창으로 띄우게 되어 있음
    window.open(`/suni-main/community/` + params.communityId + '/preview', '_blank');
  }, [params]);

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

  const handleCloseAlertWin = useCallback(() => {
    setAlertWin({ ...alertWin, alertWinOpen: false });
  }, [setAlertWin]);

  const handleAlertOk = useCallback(
    (type: string) => {
      if (type === 'justOk') handleCloseAlertWin();
    },
    [handleCloseAlertWin]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const onClickFileButton = useCallback(() => {
    if (fileInputRef.current === null) {
      return;
    }
    fileInputRef.current?.click();
  }, []);
  const IntroduceLength = (introduce && introduce.length) || 0;

  const beforeSave = useCallback(() => {
    const type = homeInfo?.type;
    const thumbnailId = homeInfo?.thumbnailId;
    const introduce = homeInfo?.introduce;
    const html = homeInfo?.html;

    if (type === undefined) {
      setAlertWin({
        alertMessage: '유형을 선택해 주세요.',
        alertWinOpen: true,
        alertTitle: '필수 정보 입력 안내',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else if (type === 'BASIC' && thumbnailId === '') {
      setAlertWin({
        alertMessage: '커뮤니티 대표 이미지를 입력하세요.',
        alertWinOpen: true,
        alertTitle: '필수 정보 입력 안내',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    }
    // else if (type === 'BASIC' && introduce === '') {
    // //   setAlertWin({
    // //     alertMessage: '환영 메세지를 입력하세요.',
    // //     alertWinOpen: true,
    // //     alertTitle: '필수 정보 입력 안내',
    // //     alertIcon: 'triangle',
    // //     alertType: 'justOk',
    // //   });
    // // } else if (type === 'HTML' && html === '') {
    // //   setAlertWin({
    // //     alertMessage: '환영 메세지를 입력하세요.',
    // //     alertWinOpen: true,
    // //     alertTitle: '필수 정보 입력 안내',
    // //     alertIcon: 'triangle',
    // //     alertType: 'justOk',
    // //   });
    //  }
    else {
      save();
      setAlertWin({
        alertMessage: '저장되었습니다.',
        alertWinOpen: true,
        alertTitle: '',
        alertIcon: 'triangle',
        alertType: '안내',
      });
    }
  }, [homeInfo, setAlertWin, save]);

  const beforePreviewSave = useCallback(() => {
    previewSave();
    setAlertWin({
      alertMessage: '임시저장 되었습니다.',
      alertWinOpen: true,
      alertTitle: '',
      alertIcon: 'triangle',
      alertType: '안내',
    });
  }, [homeInfo, setAlertWin, previewSave]);

  return (
    <>
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              홈 관리
              {homeInfo?.draft === 1 && <span>(미리보기 편집중)</span>}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">
              유형 <span className="required">*</span>
            </Table.Cell>
            <Table.Cell>
              <Form.Group>
                <Form.Field
                  width={4}
                  control={Select}
                  placeholder="Select"
                  options={homeTypes}
                  value={type}
                  onChange={changeType}
                />
              </Form.Group>
            </Table.Cell>
          </Table.Row>
          {type === 'BASIC' && (
            <Table.Row>
              <Table.Cell className="tb-header">
                커뮤니티 대표 이미지 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Button content="파일 선택" labelPosition="left" icon="file" onClick={onClickFileButton} />
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={setThumbnailId}
                  style={{ display: 'none' }}
                  accept=".jpg,.jpeg,.png,.gif"
                />
                {thumbnailId !== null && thumbnailId !== '' && (
                  <div style={{ paddingTop: '1em' }}>
                    <Image size="small" src={`/files/community/${thumbnailId}`} />
                  </div>
                )}
                <div style={{ paddingTop: '1em' }}>
                  <p className="info-text-gray">- JPG, JPEG, PNG, GIF 파일을 등록하실 수 있습니다.</p>
                  <p className="info-text-gray">- 이미지 최적 크기는 가로 300PX 입니다.</p>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
          {type === 'BASIC' && (
            <Table.Row>
              <Table.Cell className="tb-header">환영 메시지</Table.Cell>
              <Table.Cell>
                <Form.Field>
                  <div
                    className={IntroduceLength >= 50 ? 'ui right-top-count input error' : 'ui right-top-count input'}
                  >
                    <span className="count">
                      <span className="now">{IntroduceLength}</span>/<span className="max">50</span>
                    </span>
                    <input
                      id=""
                      type="text"
                      value={introduce}
                      placeholder="커뮤니티 환영 메세지를 입력해주세요. (50자까지 입력가능)"
                      onChange={changeIntroduce}
                    />
                  </div>
                </Form.Field>
              </Table.Cell>
            </Table.Row>
          )}
          {type === 'HTML' && (
            <Table.Row>
              <Table.Cell className="tb-header">
                환영 메시지 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <HtmlEditor modules={modules} formats={formats} value={html} onChange={changeHtml} onlyHtml />
              </Table.Cell>
            </Table.Row>
          )}
          <Table.Row>
            <Table.Cell className="tb-header">텍스트 칼라</Table.Cell>
            <Table.Cell>
              <SketchPicker color={color ? color : 'FFFFFF'} onChange={changeCommunityHomeColor} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell colSpan={2}>
              <div className="btn-group">
                <div className="fl-right">
                  {/* 미리보기 버튼만 만든 상태, front 작업 완료되면 링크만 연결하면 됨. */}
                  <Button onClick={beforePreviewSave}>임시 저장</Button>
                  <Button onClick={routeToPreviewPop}>미리보기</Button>
                  <Button onClick={routeToCommunityList}>목록</Button>
                  <Button primary onClick={beforeSave}>
                    저장
                  </Button>
                </div>
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <AlertWin
        message={alertWin.alertMessage}
        handleClose={handleCloseAlertWin}
        open={alertWin.alertWinOpen}
        alertIcon={alertWin.alertIcon}
        title={alertWin.alertTitle}
        type={alertWin.alertType}
        handleOk={handleAlertOk}
      />
    </>
  );
};

export default CommunityHomeView;
