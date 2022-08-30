import React from 'react';
import { Button, Form, Input, Radio } from 'semantic-ui-react';
import { FormTable } from 'shared/components';
import {
  onChangeMainNumber,
  onChangeMainNumberEnabled,
  onChangeMainNumberName,
  onClickDelete,
  onClickList,
  onClickSave,
} from 'sms/event/smsMainNumberEvent';
import { useSmsMainNumberCreateViewModel } from 'sms/store/SmsMainNumberStore';

export function SmsMainNumberCreateView() {
  const mainNumberInfo = useSmsMainNumberCreateViewModel();
  return (
    <>
      <Form>
        <FormTable title="SMS 대표번호 관리">
          <FormTable.Row name="발송처" required>
            <Form.Field
              control={Input}
              value={mainNumberInfo?.mainNumberName}
              onChange={(e: any) => onChangeMainNumberName(e.target.value)}
            />
          </FormTable.Row>
          <FormTable.Row name="등록번호" required>
            <Form.Field
              control={Input}
              value={mainNumberInfo?.mainNumber}
              onChange={(e: any) => onChangeMainNumber(e.target.value)}
            />
          </FormTable.Row>
          <FormTable.Row name="활성/비활성 구분" required>
            <Form.Group>
              <Form.Field
                control={Radio}
                label="활성"
                value={true}
                checked={mainNumberInfo?.enabled}
                onChange={(e: any, data: any) => onChangeMainNumberEnabled(true)}
              />
              <Form.Field
                control={Radio}
                label="비활성"
                value={false}
                checked={!mainNumberInfo?.enabled}
                onChange={(e: any, data: any) => onChangeMainNumberEnabled(false)}
              />
            </Form.Group>
          </FormTable.Row>
        </FormTable>
        <div className="btn-group">
          {mainNumberInfo?.id ? (
            <Button type="button" onClick={onClickDelete}>
              삭제
            </Button>
          ) : null}
          <div className="fl-right">
            <Button basic onClick={onClickList} type="button">
              목록
            </Button>
            <Button primary type="button" onClick={onClickSave}>
              저장
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
