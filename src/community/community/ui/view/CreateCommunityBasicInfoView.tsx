import React, { useCallback } from 'react';
import { Button, Select, Table, Form, Radio, Image, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import { MemberViewModel } from '@nara.drama/approval';

import { NaOffsetElementList } from 'shared/model';
import { AccessRuleSettings } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { AlertWin, ConfirmWin, isSuperManager } from 'shared/ui';

import Member from 'community/member/model/Member';
import { CommunityStore } from 'community/community';
import ManagerListModalView from 'cube/cube/ui/view/ManagerListModal';

import CommunityCdoModel from '../../model/CommunityCdoModel';
import { CommunityCourseMappingContainer } from '../logic/CommunityCourseMappingContainer';

interface CreateCommunityBasicInfoViewProps {
  communityName?: string;
  communityDescription?: string;
  communityIsOpend?: string;
  uploadFile: (file: File, setFileName: any) => void;
  selectField: any[];
  routeToCommunityList: () => void;
  saveCommunity: () => void;
  deleteCommunity: () => void;
  changeCommunityCdoProps: (name: string, value: any) => void;
  communityCdo?: CommunityCdoModel;
  checkName: () => Promise<boolean>;
  memberList: NaOffsetElementList<Member>;
  changeMemberQueryProps: (name: string, value: any) => void;
  checkGroupBasedAccessRules: () => boolean;
}
const fileInputRef = React.createRef<HTMLInputElement>();
const message = <p className="center">입력하신 커뮤니티를 저장 하시겠습니까?</p>;
const communityStore = CommunityStore.instance;

const CreateCommunityBasicInfoView: React.FC<CreateCommunityBasicInfoViewProps> = function CreateCommunityBasicInfoView(
  props
) {
  const [managerTemp, SetMangerTemp] = React.useState<Member>();

  const handleManagerListModalOk = React.useCallback((member: MemberViewModel) => {
    SetMangerTemp({
      ...managerTemp,
      memberId: member.id,
      email: member.email,
      companyCode: member.companyCode,
      name: getPolyglotToAnyString(member.name),
    });

    props.changeCommunityCdoProps('managerId', member.id);
    props.changeCommunityCdoProps('managerEmail', member.email);
    props.changeCommunityCdoProps('managerName', getPolyglotToAnyString(member.name));
    props.changeCommunityCdoProps('managerCompany', member.companyCode);
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

  // 최초 조회시에만 중복 체크 패쓰
  let defaultCheckName = false;
  if (
    props.communityCdo?.communityId !== undefined &&
    props.communityCdo?.communityId !== null &&
    props.communityCdo?.communityId !== ''
  ) {
    defaultCheckName = true;
  }
  const [checkName, setCheckName] = React.useState<boolean>(defaultCheckName);
  const [fileName, setFileName] = React.useState<string>('');

  const [coursePlanListModalOpen, setCoursePlanListModalOpen] = React.useState<boolean>(false);

  const [idSet, setIdSet] = React.useState<string[]>([]);

  function addCourseSet(coursePlan: any) {
    setIdSet([coursePlan.coursePlanId]);
    // setName(coursePlan.name);
    props.changeCommunityCdoProps('courseId', coursePlan.coursePlanId);
    props.changeCommunityCdoProps('name', coursePlan.name);
  }

  function handleSave() {
    if (!props.communityCdo) {
      return;
    }

    if (
      //props.communityCdo?.type != 'OPEN' &&
      //!props.communityCdo.communityId &&
      !checkName
    ) {
      confirmBlank('중복체크를 진행후 저장해주세요.');
      return;
    }

    if (!props.checkGroupBasedAccessRules()) {
      confirmBlank('한 개 이상의 접근제어 규칙이 필요합니다.');
      return;
    }

    const communityObject = CommunityCdoModel.isBlank(props.communityCdo);

    const communityMessage = '"' + communityObject + '" 은 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';

    if (communityObject === 'success') {
      if (!props.communityCdo.communityId) {
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
    } else if (communityObject !== 'success') confirmBlank(communityMessage);
  }

  function handleDelete() {
    if (props.communityCdo && props.communityCdo.memberCount > 1) {
      setAlertWin({
        alertMessage: '커뮤니티를 멤버를 삭제 해주세요!',
        alertWinOpen: true,
        alertTitle: '삭제 안내',
        alertIcon: 'circle',
        alertType: 'justOk',
      });
    } else {
      setAlertWin({
        alertMessage:
          '커뮤니티를 삭제 하시겠습니까?커뮤니티 멤버가 없는 경우에만 삭제가 가능하며,삭제 후 커뮤니티의 모든 정보는 없어 집니다.',
        alertWinOpen: true,
        alertTitle: '삭제 안내',
        alertIcon: 'circle',
        alertType: 'remove',
      });
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

  // 저장
  function handleOKConfirmWin(mode?: string) {
    Promise.resolve()
      .then(() => props.saveCommunity())
      .then(() => props.routeToCommunityList());
  }

  //삭제
  function deleteHandleOKConfirmWin() {
    Promise.resolve()
      .then(() => props.deleteCommunity())
      .then(() => props.routeToCommunityList());
  }

  function handleAlertOk(type: string) {
    if (type === 'justOk') handleCloseAlertWin();
    if (type === 'save') handleOKConfirmWin('modify');
    if (type === 'remove') deleteHandleOKConfirmWin();
  }

  function resetIcon() {
    setFileName('');
    props.changeCommunityCdoProps('thumbnailId', '');
  }

  const onFrontAdminClick = useCallback(() => {
    if (props.communityCdo?.communityId !== undefined) {
      if (window.location.host.toLowerCase() === 'stg-star.mysuni.sk.com') {
        const url = `${window.location.protocol}//stg.mysuni.sk.com/suni-community/admin/${props.communityCdo.communityId}`;
        window.open(url, '_blank');
        return;
      }
      if (window.location.host.toLowerCase() === 'star.mysuni.sk.com') {
        const url = `https://mysuni.sk.com/suni-community/admin/${props.communityCdo.communityId}`;
        window.open(url, '_blank');
        return;
      }
      const url = `${window.location.protocol}//stg.mysuni.sk.com/suni-community/admin/${props.communityCdo.communityId}`;
      window.open(url, '_blank');
    }
  }, [props.communityCdo?.communityId]);

  return (
    <>
      <Form>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>

          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} className="title-header">
                기본 정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!_.isEmpty(props.communityCdo?.communityId) && isSuperManager() && (
              <Table.Row>
                <Table.Cell className="tb-header">메뉴/멤버/템플릿/인트로/통계 관리</Table.Cell>
                <Table.Cell className="tb-header">
                  <Button onClick={onFrontAdminClick}>바로가기 (새창)</Button>
                </Table.Cell>
              </Table.Row>
            )}

            <Table.Row>
              {/* <Table.Cell className="tb-header">
                커뮤니티 유형 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    disabled={props.communityCdo?.communityId ? true : false}
                    width={4}
                    control={Select}
                    placeholder="Select"
                    options={SelectType.communities}
                    value={props.communityCdo?.type || 'OPEN'}
                    onChange={(e: any, data: any) => {
                      props.changeCommunityCdoProps('type', data.value);
                      props.changeCommunityCdoProps('name', '');
                    }}
                  />
                </Form.Group>
              </Table.Cell> */}
              <Table.Cell className="tb-header">
                커뮤니티 유형
                <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    disabled={props.communityCdo?.communityId ? true : false}
                    control={Radio}
                    label="일반형"
                    value="OPEN"
                    checked={props.communityCdo?.type === 'OPEN'}
                    onChange={(e: any, data: any) => props.changeCommunityCdoProps('type', 'OPEN')}
                  />
                  <Form.Field
                    disabled={props.communityCdo?.communityId ? true : false}
                    control={Radio}
                    label="비밀형"
                    value="SECRET"
                    checked={props.communityCdo?.type === 'SECRET'}
                    onChange={(e: any, data: any) => props.changeCommunityCdoProps('type', 'SECRET')}
                  />
                  <Form.Field
                    disabled={props.communityCdo?.communityId ? true : false}
                    control={Radio}
                    label="폐쇄형"
                    value="COHORT"
                    checked={props.communityCdo?.type === 'COHORT'}
                    onChange={(e: any, data: any) => props.changeCommunityCdoProps('type', 'COHORT')}
                  />
                </Form.Group>
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span>
                  일반형: 모든 mySuni 학습자 구성원이 접근 할 수 있습니다.
                </p>
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span>
                  비밀형: 비밀번호를 알고있는 구성원이 접근 할 수 있습니다.
                </p>
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span>
                  폐쇄형: 관리자가 멤버 일괄 등록을 통해 가입할 수 있으며,멤버들만 접근 할 수 있습니다.
                </p>
              </Table.Cell>
            </Table.Row>
            <CommunityCourseMappingContainer />
            {props.communityCdo?.type != 'COHORT' ? (
              <Table.Row>
                <Table.Cell className="tb-header">
                  분야 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      width={4}
                      control={Select}
                      placeholder="Select"
                      options={props.selectField}
                      value={props.communityCdo?.field}
                      onChange={(e: any, data: any) =>
                        //setCommunityField(data.value)
                        props.changeCommunityCdoProps('field', data.value)
                      }
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
            ) : null}
            {/* {props.communityCdo?.type == 'OPEN' ? ( */}
            <Table.Row>
              <Table.Cell className="tb-header">
                썸네일 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Button
                  className="file-select-btn"
                  content={fileName || '파일 선택'}
                  labelPosition="left"
                  icon="file"
                  onClick={() => {
                    if (fileInputRef && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                />
                <input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    e.target.files && props.uploadFile(e.target.files[0], setFileName)
                  }
                  accept=".png, .jpg"
                  hidden
                />

                {props.communityCdo?.thumbnailId ? (
                  <Segment.Inline>
                    <Image src={props.communityCdo?.thumbnailId} size="small" />
                    <Button onClick={resetIcon} type="button">
                      Icon 초기화
                    </Button>
                  </Segment.Inline>
                ) : null}
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span>
                  이미지 최적 사이즈는 가로 100x100사이즈를 추천 합니다.
                </p>
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span>
                  jpg,jpeg,png,gif확장자만 첨부 가능합니다.
                </p>
              </Table.Cell>
            </Table.Row>
            {/* ) : null} */}
            {/* {props.communityCdo?.type === 'OPEN' ? (
              <Table.Row>
                <Table.Cell className="tb-header">
                  Course 선택 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <CoursePlanListModal
                    open={coursePlanListModalOpen}
                    show={setCoursePlanListModalOpen}
                    addCourseSet={addCourseSet}
                    courseIdSet={idSet}
                    community={true}
                  />
                </Table.Cell>
              </Table.Row>
            ) : null} */}

            <Table.Row>
              <Table.Cell className="tb-header">
                커뮤니티명
                <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Button
                  onClick={(e: any, data: any) => {
                    let checkMessage = '중복체크 실패';
                    if (!props.communityCdo?.name) {
                      checkMessage = '커뮤니티명을 입력해 주세요.';
                      setCheckName(false);
                    } else {
                      props.checkName().then((response) => {
                        if (response) {
                          checkMessage = '중복된 이름 입니다.';
                          setCheckName(false);
                        } else {
                          checkMessage = '사용해도 되는 이름 입니다.';
                          setCheckName(true);
                        }
                        setAlertWin({
                          alertMessage: checkMessage,
                          alertWinOpen: true,
                          alertTitle: '중복 체크 안내',
                          alertIcon: 'triangle',
                          alertType: 'justOk',
                        });
                      });
                    }
                  }}
                  type="button"
                >
                  중복체크
                </Button>
                {/* {!props.communityCdo?.communityId ? (
                  <Button
                    onClick={(e: any, data: any) => {
                      let checkMessage = '중복체크 실패';
                      if (!props.communityCdo?.name) {
                        checkMessage = '커뮤니티명을 입력해 주세요.';
                        setCheckName(false);
                      } else {
                        props.checkName().then((response) => {
                          if (response) {
                            checkMessage = '중복된 이름 입니다.';
                            setCheckName(false);
                          } else {
                            checkMessage = '사용해도 되는 이름 입니다.';
                            setCheckName(true);
                          }
                          setAlertWin({
                            alertMessage: checkMessage,
                            alertWinOpen: true,
                            alertTitle: '중복 체크 안내',
                            alertIcon: 'triangle',
                            alertType: 'justOk',
                          });
                        });
                      }
                    }}
                    type="button"
                  >
                    중복체크
                  </Button>
                ) : null} */}
                <Form.Field
                //disabled={props.communityCdo?.communityId ? true : false}
                >
                  <div
                    className={
                      props.communityCdo?.name && props.communityCdo?.name.length >= 100
                        ? 'ui right-top-count input error'
                        : 'ui right-top-count input'
                    }
                    style={{ width: '80%' }}
                  >
                    <span className="count">
                      <span className="now">{(props.communityCdo?.name && props.communityCdo?.name.length) || 0}</span>/
                      <span className="max">100</span>
                    </span>
                    <input
                      id="communityName"
                      type="text"
                      placeholder="커뮤니티명을 입력해주세요. (100자까지 입력가능)"
                      value={props.communityCdo?.name}
                      onChange={(e: any) => {
                        props.changeCommunityCdoProps('name', e.target.value);
                        setCheckName(false);
                      }}
                    />
                  </div>
                </Form.Field>
              </Table.Cell>
            </Table.Row>
            {/* {props.communityCdo?.type == 'OPEN' ? ( */}
            <Table.Row>
              <Table.Cell className="tb-header">
                커뮤니티 설명 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Field>
                  <div
                    className={
                      props.communityCdo?.description && props.communityCdo?.description.length >= 100
                        ? 'ui right-top-count input error'
                        : 'ui right-top-count input'
                    }
                  >
                    <span className="count">
                      <span className="now">
                        {(props.communityCdo?.description && props.communityCdo?.description.length) || 0}
                      </span>
                      /<span className="max">100</span>
                    </span>
                    <input
                      id="communityDescription"
                      type="text"
                      placeholder="커뮤니티설명을 입력해주세요. (100자까지 입력가능)"
                      value={props.communityCdo?.description}
                      onChange={(e: any) => props.changeCommunityCdoProps('description', e.target.value)}
                    />
                  </div>
                </Form.Field>
              </Table.Cell>
            </Table.Row>
            {/* ) : null} */}

            <Table.Row>
              <Table.Cell className="tb-header">
                관리자 정보 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <ManagerListModalView
                  handleOk={handleManagerListModalOk}
                  buttonName="대표 관리자 선택"
                  multiSelect={false}
                />
                {props.communityCdo?.managerName ? (
                  <Table celled>
                    <colgroup>
                      <col width="20%" />
                      <col width="20%" />
                      <col width="20%" />
                      <col width="40%" />
                    </colgroup>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell textAlign="center">대표 관리자 지정</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {props.memberList.results
                        .filter((f) => f.memberType === 'ADMIN')
                        .map((member, index) => (
                          <Table.Row key={index}>
                            <Table.Cell textAlign="center">
                              <Form.Field
                                control={Radio}
                                value={member.memberId}
                                checked={props.communityCdo?.managerId === member.memberId}
                                onChange={(e: any, data: any) => {
                                  props.changeCommunityCdoProps('managerId', data.value);
                                }}
                              />
                            </Table.Cell>
                            <Table.Cell>{member.companyCode}</Table.Cell>
                            <Table.Cell>{member.name}</Table.Cell>
                            <Table.Cell>{member.email}</Table.Cell>
                          </Table.Row>
                        ))}
                      {managerTemp?.memberId &&
                      !props.memberList.results.some(
                        (f) => f.memberId === managerTemp?.memberId && f.memberType === 'ADMIN'
                      ) ? (
                        <Table.Row>
                          <Table.Cell textAlign="center">
                            <Form.Field
                              control={Radio}
                              value={managerTemp?.memberId}
                              checked={props.communityCdo?.managerId === managerTemp?.memberId}
                              onChange={(e: any, data: any) => {
                                props.changeCommunityCdoProps('managerId', data.value);
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>{managerTemp?.companyCode}</Table.Cell>
                          <Table.Cell>{managerTemp?.name}</Table.Cell>
                          <Table.Cell>{managerTemp?.email}</Table.Cell>
                        </Table.Row>
                      ) : null}
                    </Table.Body>
                  </Table>
                ) : null}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">
                공개 여부 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    control={Radio}
                    label="비공개"
                    value="0"
                    checked={props.communityCdo?.visible === '0'}
                    onChange={(e: any, data: any) => props.changeCommunityCdoProps('visible', '0')}
                  />
                  <Form.Field
                    control={Radio}
                    label="공개"
                    value="1"
                    checked={props.communityCdo?.visible === '1'}
                    onChange={(e: any, data: any) => props.changeCommunityCdoProps('visible', '1')}
                  />
                </Form.Group>
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span> 비공개: 커뮤니티가 공개되지 않습니다.
                </p>
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span> 공개: 누구나 해당 커뮤니티에 접근 할 수 있습니다.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">
                가입 신청 설정 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    control={Radio}
                    label="가입신청"
                    value="0"
                    checked={props.communityCdo?.allowSelfJoin === 0}
                    onChange={(e: any, data: any) => props.changeCommunityCdoProps('allowSelfJoin', 0)}
                  />
                  <Form.Field
                    control={Radio}
                    label="자동가입"
                    value="1"
                    checked={props.communityCdo?.allowSelfJoin === 1}
                    onChange={(e: any, data: any) => props.changeCommunityCdoProps('allowSelfJoin', 1)}
                  />
                </Form.Group>
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span> 가입신청: 가입 시 관리자 승인이 필요 합니다.
                </p>
                <p style={{ marginBottom: '0.35rem', color: 'red' }}>
                  <span className="required">*</span> 자동가입: 가입 시 관리자 승인 없이 바로 활동이 가능 합니다.
                </p>
              </Table.Cell>
            </Table.Row>
            {props.communityCdo?.type === 'SECRET' ? (
              <Table.Row>
                <Table.Cell className="tb-header">
                  비밀번호 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Field>
                    <div style={{ width: '20%' }}>
                      <input
                        id="secretNumber"
                        type="text"
                        placeholder="숫자 4자리를 입력해주세요"
                        value={props.communityCdo?.secretNumber}
                        maxLength={4}
                        onChange={(e: any) => props.changeCommunityCdoProps('secretNumber', e.target.value)}
                      />
                    </div>
                  </Form.Field>
                </Table.Cell>
              </Table.Row>
            ) : null}
          </Table.Body>
        </Table>
      </Form>
      <AccessRuleSettings />

      <div className="btn-group">
        {props.communityCdo?.communityId !== '' ? (
          <div className="fl-left">
            <Button onClick={handleDelete} type="button">
              삭제
            </Button>
          </div>
        ) : null}

        <div className="fl-right">
          <Button onClick={props.routeToCommunityList}>목록</Button>
          <Button onClick={handleSave} primary>
            저장
          </Button>
        </div>
      </div>

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
        id={props.communityCdo?.communityId}
        message={message}
        open={confirmWin.confirmWinOpen}
        handleClose={handleCloseConfirmWin}
        handleOk={handleOKConfirmWin}
        handleSaveAndApprove={handleOKConfirmWin}
        title="저장 안내"
        buttonYesName="저장"
        buttonNoName="취소"
        isSaveAndApprove={confirmWin.isSaveAndApprove}
        state="save"
      />
    </>
  );
};

export default CreateCommunityBasicInfoView;
