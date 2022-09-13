import React from 'react';
import { Form, Input, InputOnChangeData, Radio, Table, TextArea, TextAreaProps } from 'semantic-ui-react';
import { onChangeLanguage } from '../../handler/TestCreateBasicInfoHandler';

interface TestCreateBasicInfoViewProps {
  finalCopy: boolean;
  title: string;
  description: string;
  applyLimit: string;
  authorName: string;
  email: string;
  language: string;
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void;
  onChangeDescription: (e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => void;
  onChangeApplyLimit: (value: string) => void;
}

export function TestCreateBasicInfoView({
  finalCopy,
  title,
  description,
  applyLimit,
  authorName,
  email,
  language,
  onChangeTitle,
  onChangeDescription,
  onChangeApplyLimit,
}: TestCreateBasicInfoViewProps) {
  return (
    <>
      <Form>
        <Table celled>
          <colgroup>
            <col width="13%" />
            <col width="31%" />
            <col width="13%" />
            <col width="15%" />
            <col width="13%" />
            <col width="15%" />
          </colgroup>

          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="title-header" colSpan={6}>
                Test 정보 설정
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">Languages</Table.Cell>
              <Table.Cell colSpan={5}>
                <Form.Group>
                  <Form.Field
                    key={'Korean'}
                    label={'KO'}
                    control={Radio}
                    checked={language === 'Korean'}
                    onChange={() => onChangeLanguage('Korean')}
                  />
                  <Form.Field
                    key={'English'}
                    label={'EN'}
                    control={Radio}
                    checked={language === 'English'}
                    onChange={() => onChangeLanguage('English')}
                  />
                  <Form.Field
                    key={'Chinese'}
                    label={'ZH'}
                    control={Radio}
                    checked={language === 'Chinese'}
                    onChange={() => onChangeLanguage('Chinese')}
                  />
                </Form.Group>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">
                제목 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell colSpan={5}>
                <div className={title.length >= 80 ? 'ui right-top-count input error' : 'ui right-top-count input'}>
                  <span className="count">
                    <span className="now">{title.length}</span>/<span className="max">80</span>
                  </span>
                  <Form.Field
                    width={16}
                    control={Input}
                    id="title"
                    type="text"
                    placeholder="Test 제목을 입력해주세요. (최대 80자까지 입력가능)"
                    value={title}
                    onChange={onChangeTitle}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
            {/* <Table.Row>
              <Table.Cell className="tb-header">
                Test 설명 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell colSpan={5}>
                <div
                  className={description.length >= 1000 ? 'ui right-top-count input error' : 'ui right-top-count input'}
                >
                  <span className="count">
                    <span className="now">{description.length}</span>/<span className="max">1,000</span>
                  </span>
                  <TextArea
                    placeholder="Test 설명을 입력해주세요. (최대 1,000자까지 입력가능)"
                    rows={3}
                    className="height-rows"
                    value={description}
                    onChange={onChangeDescription}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">응시 제한</Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    readOnly={finalCopy}
                    control={Input}
                    width={3}
                    className="min-width-100"
                    type="number"
                    min={0}
                    value={applyLimit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) =>
                      onChangeApplyLimit(data.value)
                    }
                  />
                  <span className="label">* 1일 응시횟수 제한 설정입니다. 0 일 경우 응시 제한이 없습니다.</span>
                </Form.Group>
              </Table.Cell>
              <Table.Cell className="tb-header">출제자</Table.Cell>
              <Table.Cell>{authorName}</Table.Cell>
              <Table.Cell className="tb-header">출제자 E-mail</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
            </Table.Row> */}
          </Table.Body>
        </Table>
      </Form>
    </>
  );
}
