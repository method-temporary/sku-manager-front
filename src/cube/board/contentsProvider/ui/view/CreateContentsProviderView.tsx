import * as React from 'react';
import {
  Breadcrumb,
  Button,
  Container,
  Form,
  Header,
  Icon,
  Image,
  Input,
  Radio,
  Segment,
  Select,
  Table,
} from 'semantic-ui-react';

import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { PolyglotModel, SelectType } from 'shared/model';
import { Polyglot } from 'shared/components';
import { DEFAULT_LANGUAGE, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { AlertWin, ConfirmWin, DepotUtil } from 'shared/ui';

import ContentsProviderCdoModel from '../../model/ContentsProviderCdoModel';
import { findByProviderName } from '../../api/ContentsProviderApi';

interface CreateContentsProviderViewProps {
  uploadFile: (file: File, setFileName: any) => void;
  routeToContentsProviderList: () => void;
  saveContentsProvider: () => void;
  changeContentsProviderCdoProps: (name: string, value: any) => void;
  contentsProviderCdo?: ContentsProviderCdoModel;
  deleteContentsProvider: () => void;
}

const fileInputRef = React.createRef<HTMLInputElement>();
// const message = <p className="center">입력하신 게시물을 저장 하시겠습니까?</p>;
const CreateContentsProviderView: React.FC<CreateContentsProviderViewProps> = function CreateContentsProviderView(
  props
) {
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
    if (props.contentsProviderCdo && props.contentsProviderCdo?.id) {
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

  function handleSave(event: any, data: any, index?: number) {
    if (!props.contentsProviderCdo) {
      return;
    }
    if (index === undefined) {
      index = 0;
    }

    findByProviderName(
      getPolyglotToAnyString(props.contentsProviderCdo.name, props.contentsProviderCdo.langSupports[index].lang)
    ).then((response) => {
      if (response !== null && response !== '') {
        handleSaveAfterCheckDuplicate(response);
      } else {
        if (!props.contentsProviderCdo) {
          return;
        }
        if (index === undefined) {
          index = 0;
        }
        if (index === props.contentsProviderCdo?.langSupports.length - 1) {
          handleSaveAfterCheckDuplicate(response);
        } else {
          handleSave('', '', index + 1);
        }
      }
    });
  }

  function handleSaveAfterCheckDuplicate(response: string) {
    if (!props.contentsProviderCdo) {
      return;
    }

    const contentsProviderObject = ContentsProviderCdoModel.isBlank(props.contentsProviderCdo);

    const contentsProviderMessage =
      '"' + contentsProviderObject + '" 은 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';

    if (!props.contentsProviderCdo?.id && props.contentsProviderCdo?.name) {
      if (response !== null && response !== '') {
        setAlertWin({
          alertMessage: '교육기관명이 중복되었습니다.',
          alertWinOpen: true,
          alertTitle: '교육기관명 중복등록 안내',
          alertIcon: 'triangle',
          alertType: 'justOk',
        });
      } else {
        if (contentsProviderObject === 'success') {
          if (!props.contentsProviderCdo?.id) {
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
        } else if (contentsProviderObject !== 'success') {
          confirmBlank(contentsProviderMessage);
        }
      }
    } else {
      if (props.contentsProviderCdo?.id !== response && response !== '') {
        setAlertWin({
          alertMessage: '교육기관명이 중복되었습니다..',
          alertWinOpen: true,
          alertTitle: '교육기관명 중복등록 안내',
          alertIcon: 'triangle',
          alertType: 'justOk',
        });
      } else {
        if (contentsProviderObject === 'success') {
          if (props.contentsProviderCdo?.id) {
            setAlertWin({
              alertMessage: '교육기관명이 중복되었습니다..',
              alertWinOpen: true,
              alertTitle: '교육기관명 중복등록 안내',
              alertIcon: 'triangle',
              alertType: 'justOk',
            });
          } else {
            // console.log(3);
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
        } else if (contentsProviderObject !== 'success') {
          confirmBlank(contentsProviderMessage);
        }
      }
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
  function deleteHandleOKConfirmWin() {
    //todo promis then 처리 추가 예정
    Promise.resolve()
      .then(() => props.deleteContentsProvider())
      .then(() => props.routeToContentsProviderList());
  }

  // 저장
  function updateHandleOKConfirmWin() {
    //todo promis then 처리 추가 예정
    Promise.resolve()
      .then(() => props.saveContentsProvider())
      .then(() => props.routeToContentsProviderList());
  }

  function handleAlertOk(type: string) {
    if (type === 'justOk') handleCloseAlertWin();
    if (type === 'remove') deleteHandleOKConfirmWin();
    if (type === 'save') updateHandleOKConfirmWin();
  }

  const [fileName, setFileName] = React.useState<string>('');

  function resetIcon() {
    setFileName('');
    props.changeContentsProviderCdoProps('thumbnailPath', '');
  }

  function getFileBoxIdForReference(fileBoxId: string) {
    //
    props.changeContentsProviderCdoProps('depotId', fileBoxId);
  }

  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={SelectType.contentsProviderSections} />
        <Header as="h2">교육기관 관리</Header>
      </div>
      <Form>
        <Polyglot languages={props.contentsProviderCdo?.langSupports || [DEFAULT_LANGUAGE]}>
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={2}>교육기관 관리</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell className="tb-header">
                  지원 언어 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Polyglot.Languages onChangeProps={props.changeContentsProviderCdoProps} />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">
                  기본 언어 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Polyglot.Default onChangeProps={props.changeContentsProviderCdoProps} />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  교육기관명<span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Field>
                    {/*<div
                      className={
                        props.contentsProviderCdo?.name && props.contentsProviderCdo?.name.length >= 500
                          ? 'ui right-top-count input error'
                          : 'ui right-top-count input'
                      }
                    >
                      <span className="count">
                        <span className="now">{props.contentsProviderCdo?.name.length}</span>/
                        <span className="max">500</span>
                      </span>
                      <input
                        id="providerName"
                        type="text"
                        placeholder="Please enter the name of the educational institution. (Up to 500 characters)"
                        value={props.contentsProviderCdo?.name}
                        onChange={(e: any) => {
                          props.changeContentsProviderCdoProps('name', e.target.value);
                        }}
                      />
                    </div>*/}
                    <Polyglot.Input
                      languageStrings={props.contentsProviderCdo?.name || new PolyglotModel()}
                      name="name"
                      onChangeProps={props.changeContentsProviderCdoProps}
                      placeholder="교육기관명을 입력해주세요. (500자까지 입력가능)"
                      maxLength="500"
                    />
                  </Form.Field>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  구분 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      width={4}
                      control={Select}
                      placeholder="Select"
                      options={SelectType.areaType}
                      value={props.contentsProviderCdo?.areaType}
                      onChange={(e: any, data: any) => props.changeContentsProviderCdoProps('areaType', data.value)}
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  활성/비활성 구분 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      control={Radio}
                      label="활성"
                      value={true}
                      checked={props.contentsProviderCdo?.enabled}
                      onChange={(e: any, data: any) => props.changeContentsProviderCdoProps('enabled', true)}
                    />
                    <Form.Field
                      control={Radio}
                      label="비활성"
                      value={false}
                      checked={!props.contentsProviderCdo?.enabled}
                      onChange={(e: any, data: any) => props.changeContentsProviderCdoProps('enabled', false)}
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>기관대표 대표번호</Table.Cell>
                <Table.Cell>
                  <Form.Field
                    control={Input}
                    placeholder="기관대표 대표번호를 입력해주세요."
                    value={props.contentsProviderCdo?.phoneNumber}
                    onChange={(e: any) => props.changeContentsProviderCdoProps('phoneNumber', e.target.value)}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>기관대표 E-mail</Table.Cell>
                <Table.Cell>
                  <Form.Field
                    control={Input}
                    placeholder="기관대표 E-mail을 입력해주세요."
                    value={props.contentsProviderCdo?.email}
                    onChange={(e: any) => props.changeContentsProviderCdoProps('email', e.target.value)}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  Introducation Page 내 바로가기 링크 적용 여부
                  <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      control={Radio}
                      label="Yes"
                      value={true}
                      checked={props.contentsProviderCdo?.link}
                      onChange={(e: any, data: any) => {
                        props.changeContentsProviderCdoProps('link', true);
                        props.changeContentsProviderCdoProps('url', '');
                      }}
                    />
                    <Form.Field
                      control={Radio}
                      label="No"
                      value={false}
                      checked={!props.contentsProviderCdo?.link}
                      onChange={(e: any, data: any) => {
                        props.changeContentsProviderCdoProps('link', false);
                        props.changeContentsProviderCdoProps('url', '');
                      }}
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              {props.contentsProviderCdo?.link && (
                <Table.Row>
                  <Table.Cell>교육기관 URL</Table.Cell>
                  <Table.Cell>
                    <Form.Field
                      control={Input}
                      placeholder="교육기관 URL을 입력해주세요."
                      value={props.contentsProviderCdo?.url}
                      onChange={(e: any) => props.changeContentsProviderCdoProps('url', e.target.value)}
                    />
                  </Table.Cell>
                </Table.Row>
              )}
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
                    hidden
                  />

                  {props.contentsProviderCdo?.thumbnailPath ? (
                    <Segment.Inline>
                      <Image src={props.contentsProviderCdo?.thumbnailPath} size="small" />
                      <Button onClick={resetIcon} type="button">
                        Icon 초기화
                      </Button>
                    </Segment.Inline>
                  ) : null}
                  <p className="info-text-gray">- JPG, PNG 파일을 등록하실 수 있습니다.</p>
                  <p className="info-text-gray">- 최대 300KB 용량의 파일을 등록하실 수 있습니다.</p>
                  <p className="info-text-gray">- Icon의 경우 100x100의 사이즈를 추천합니다..</p>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>첨부파일</Table.Cell>
                <Table.Cell>
                  <div className="lg-attach">
                    <div className="attach-inner">
                      <FileBox
                        id={props.contentsProviderCdo?.depotId || ''}
                        vaultKey={{
                          keyString: 'sku-depot',
                          patronType: PatronType.Pavilion,
                        }}
                        patronKey={{
                          keyString: 'sku-denizen',
                          patronType: PatronType.Denizen,
                        }}
                        validations={[
                          {
                            type: ValidationType.Duplication,
                            validator: DepotUtil.duplicationValidator,
                          },
                        ]}
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
                <Table.Cell>비고</Table.Cell>
                <Table.Cell>
                  <div
                    className={
                      props.contentsProviderCdo?.remark && props.contentsProviderCdo?.remark.length >= 1000
                        ? 'ui right-top-count input error'
                        : 'ui right-top-count input'
                    }
                  >
                    <span className="count">
                      <span className="now">{props.contentsProviderCdo?.remark?.length}</span>/
                      <span className="max">1000</span>
                    </span>
                    <textarea
                      placeholder="해당 교육기간 관련 특이사항을 입력해주시기 바랍니다.(계약 범위 등)"
                      value={props.contentsProviderCdo?.remark}
                      onChange={(e: any) => props.changeContentsProviderCdoProps('remark', e.target.value)}
                    />
                    <span className="validation">You can enter up to 1000 characters.</span>
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Polyglot>
        <div className="btn-group">
          {props.contentsProviderCdo?.id ? (
            <Button onClick={handleDelete} type="button">
              {/* TODO : 매핑된 Cube있는 경우 삭제 불가 처리? 요건 재 확인후 수정 예정 */}
              삭제
            </Button>
          ) : null}
          <div className="fl-right">
            <Button basic onClick={props.routeToContentsProviderList} type="button">
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

export default CreateContentsProviderView;
