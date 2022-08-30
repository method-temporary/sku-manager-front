import React, { useState } from 'react';
import { Button, ButtonProps, Form, Grid, Radio, Select, TextArea, TextAreaProps } from 'semantic-ui-react';
import { patronInfo } from '@nara.platform/dock';

import { SearchFilter, SelectOption, PolyglotModel } from 'shared/model';
import { FormTable } from 'shared/components';
import { getPolyglotToAnyString, setPolyglotValues } from 'shared/components/Polyglot';

import { SmsMainNumberListViewModel } from 'sms/viewmodel/SmsMainNumberViewModel';

interface SmsSendFormViewProps {
  from: string;
  to: string;
  message: string;
  mainNumbers?: SmsMainNumberListViewModel;
  userInfo?: { userPhone: string; userAllowed: boolean };
  onChangeFrom: (value: string) => void;
  onChangeTo: (event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => void;
  onChangeMessage: (event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => void;
  onClickList: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void;
  onClickSendSms: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void;
}

export function SmsSendFormView({
  from,
  to,
  message,
  mainNumbers,
  userInfo,
  onChangeFrom,
  onChangeTo,
  onChangeMessage,
  onClickList,
  onClickSendSms,
}: SmsSendFormViewProps) {
  const [senderRadio, setSenderRadio] = useState<string>(SearchFilter.SearchOff);

  const names = JSON.parse(patronInfo.getPatronName() || '') || '';
  const polyglotName: PolyglotModel = setPolyglotValues(names.ko, names.en, names.zh);

  const mainNumbersSelctType: SelectOption[] = [];
  mainNumbers?.results?.map((result, index) =>
    mainNumbersSelctType.push({
      key: index.toString(),
      text: result.name,
      value: result.phone,
    })
  );
  return (
    <Form>
      <FormTable title="SMS 발송 정보">
        <FormTable.Row name="일괄 등록 수신자" required>
          <Form.Field
            style={{ width: '14rem', height: '24rem', fontSize: '1rem' }}
            control={TextArea}
            placeholder="수신자 구분 시, 줄바꿈하여 번호를 입력해 주세요. (동일 수신번호 중복 등록 시, 중복 발송됩니다)"
            value={to}
            onChange={onChangeTo}
          />
        </FormTable.Row>
        <FormTable.Row name="내용" required>
          <Form.Field
            style={{ width: '18rem', height: '14rem', fontSize: '1rem' }}
            control={TextArea}
            placeholder="내용을 입력해 주세요."
            value={message}
            onChange={onChangeMessage}
          />
        </FormTable.Row>
        <FormTable.Row name="발신자 번호" required>
          <Form.Group>
            <Form.Field>
              <Radio
                label={getPolyglotToAnyString(polyglotName)}
                name="radioGroup"
                value={SearchFilter.SearchOff}
                checked={senderRadio === SearchFilter.SearchOff}
                onChange={(e: any, data: any) => {
                  setSenderRadio(data.value);
                  onChangeFrom(userInfo?.userPhone || '');
                }}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                name="radioGroup"
                value={SearchFilter.SearchOn}
                checked={senderRadio === SearchFilter.SearchOn}
                onChange={(e: any, data: any) => {
                  setSenderRadio(data.value);
                  onChangeFrom('');
                }}
              />
            </Form.Field>
            <Form.Field
              width={4}
              control={Select}
              placeholder="Select"
              options={mainNumbersSelctType}
              value={from}
              onChange={(e: any, data: any) => onChangeFrom(data.value)}
              disabled={senderRadio === SearchFilter.SearchOff}
            />
          </Form.Group>
          {senderRadio === SearchFilter.SearchOn && (
            <span style={{ color: 'grey', fontSize: '11px' }}>
              발신 번호 <span>{from}</span>
            </span>
          )}
        </FormTable.Row>
      </FormTable>
      <Grid className="list-info right">
        <Grid.Row>
          <Grid.Column>
            <Button style={{ width: '120px', height: '35px' }} onClick={onClickList} type="button">
              목록
            </Button>
            <Button primary style={{ width: '120px', height: '35px' }} onClick={onClickSendSms} type="button">
              SMS 보내기
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
}
