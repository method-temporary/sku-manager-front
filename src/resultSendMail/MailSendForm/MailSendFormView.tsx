import React from 'react';
import { observer } from 'mobx-react';
import { Form, Table, Radio, Grid, Button, Input, CheckboxProps } from 'semantic-ui-react';
import { SelectType, SearchFilter, SendEmailModel } from 'shared/model';
import { commonHelper } from 'shared/helper';
import { HtmlEditor } from 'shared/ui';

interface MailSendFormViewProps {
  sendEmails: SendEmailModel;
  onChangeTitle: (event: React.FormEvent<HTMLInputElement>) => void;
  onChangeContent: (html: string) => void;
  onChangeSendType: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void;
  onChangeSearchFilter: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void;
  onChangeSenderName: (event: React.FormEvent<HTMLInputElement>) => void;
  onChangeSenderEmail: (event: React.FormEvent<HTMLInputElement>) => void;
  onChangeSender: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void;
  onClickExcelUpload: () => void;
  onClickSend: () => void;
  onClickList: () => void;
}

function MailSendFormView({
  sendEmails,
  onChangeTitle,
  onChangeContent,
  onChangeSendType,
  onChangeSearchFilter,
  onChangeSenderName,
  onChangeSenderEmail,
  onChangeSender,
  onClickExcelUpload,
  onClickSend,
  onClickList,
}: MailSendFormViewProps) {
  const uploadEmails = sendEmails.names.join(', ');
  const isValidEmail = commonHelper.chkEmailAddr(sendEmails.dispatcherEmail);

  return (
    <Form>
      <Table celled>
        <colgroup>
          <col width="25%" />
          <col width="75%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              일괄 등록 수신자
              <br />
              <span className="span-information">
                ※ 수신자는 3,000명 이하를 권장합니다 <br />
                (초과 시 시스템 과부하가 발생할 수 있으므로, 가급적 업무 외 시간에 발송을 부탁드립니다.)
              </span>
            </Table.Cell>
            <Table.Cell>
              <div>
                <div style={{ width: '90%', float: 'left' }}>
                  <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                    업로드 수신자 {sendEmails.names && sendEmails.names.length} 명
                  </span>
                  <p />
                  {uploadEmails}
                </div>
                <div style={{ width: '10%', float: 'right' }}>
                  <Button onClick={onClickExcelUpload} type="button">
                    엑셀 업로드
                  </Button>
                </div>
              </div>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              메일 발신자 선택<span className="required">*</span>
              <br />
              <span className="span-information">
                (2022년 8월 10일부터 메일 발신 계정이 @mysuni.sk.com에서 @mysuni.com으로 변경되었습니다.)
              </span>
            </Table.Cell>
            <Table.Cell>
              <Form.Group>
                <Form.Field>
                  <Radio
                    label="mysuni@mysuni.com"
                    name="radioGroup_sender"
                    checked={sendEmails.senderEmail === 'mysuni@mysuni.com'}
                    value="mysuni@mysuni.com"
                    onChange={onChangeSender}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="mysunic@mysuni.com"
                    name="radioGroup_sender"
                    checked={sendEmails.senderEmail === 'mysunic@mysuni.com'}
                    value="mysunic@mysuni.com"
                    onChange={onChangeSender}
                  />
                </Form.Field>
              </Form.Group>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              타이틀<span className="required">*</span>
            </Table.Cell>
            <Table.Cell>
              <Form.Field
                fluid
                control={Input}
                placeholder="타이틀을 입력해주세요."
                value={sendEmails.title}
                onChange={onChangeTitle}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              내용<span className="required">*</span>
            </Table.Cell>
            <Table.Cell>
              <HtmlEditor
                modules={SelectType.modules}
                formats={SelectType.formats}
                placeholder="내용을 입력해주세요. 이미지 2Mb 까지 권장"
                value={sendEmails.mailContents}
                onChange={onChangeContent}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              템플릿포함 여부<span className="required">*</span>
            </Table.Cell>
            <Table.Cell>
              <Form.Group>
                <Form.Field>
                  <Radio
                    label="Y"
                    name="SendTypeRadioGroup"
                    value="1"
                    checked={sendEmails.sendType === '1'}
                    onChange={onChangeSendType}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="N"
                    name="SendTypeRadioGroup"
                    value="2"
                    checked={sendEmails.sendType === '2'}
                    onChange={onChangeSendType}
                  />
                </Form.Field>
              </Form.Group>
            </Table.Cell>
          </Table.Row>
          {sendEmails.sendType === '1' && (
            <Table.Row>
              <Table.Cell>
                메일 본문 하단 담당자 표시<span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field>
                    <Radio
                      label="mysuni_admin@sk.com"
                      name="radioGroup"
                      value={SearchFilter.SearchOn}
                      checked={sendEmails.searchFilter === SearchFilter.SearchOn}
                      onChange={onChangeSearchFilter}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Radio
                      label="직접입력"
                      name="radioGroup"
                      value={SearchFilter.SearchOff}
                      checked={sendEmails.searchFilter === SearchFilter.SearchOff}
                      onChange={onChangeSearchFilter}
                    />
                  </Form.Field>
                </Form.Group>
                {sendEmails.sendType === '1' && sendEmails.searchFilter === SearchFilter.SearchOff && (
                  <Form.Group style={{ display: 'flex', alignItems: 'center', marginTop: '0.8rem' }}>
                    이름<span className="required">*</span>
                    <Form.Field
                      width={3}
                      control={Input}
                      placeholder="이름을 입력해주세요."
                      value={sendEmails.dispatcherName}
                      onChange={onChangeSenderName}
                    />
                    이메일<span className="required">*</span>
                    <Form.Field
                      width={4}
                      control={Input}
                      placeholder="이메일을 입력해주세요."
                      value={sendEmails.dispatcherEmail}
                      onChange={onChangeSenderEmail}
                    />
                    {isValidEmail === false && (
                      <p
                        style={{
                          color: 'red',
                          textAlign: 'left',
                          fontSize: '0.8rem',
                          padding: 0,
                        }}
                      >
                        ※ 정확한 이메일 정보를 입력하셔야 합니다.
                      </p>
                    )}
                  </Form.Group>
                )}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <Grid className="list-info right">
        <Grid.Row>
          <Grid.Column>
            <Button style={{ width: '120px', height: '35px' }} onClick={onClickList} type="button">
              목록
            </Button>
            <Button style={{ width: '120px', height: '35px' }} onClick={onClickSend} type="button">
              메일보내기
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
}

export default observer(MailSendFormView);
