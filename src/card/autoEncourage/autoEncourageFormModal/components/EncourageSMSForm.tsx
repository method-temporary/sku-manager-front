import React, { useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { Form, Select, Table, TextArea, DropdownProps } from 'semantic-ui-react';
import { find, isEmpty } from 'lodash';
import {
  initRepresentativeNumberParams,
  useFindEnableRepresentativeNumber,
  useFindUser,
} from '../autoEncourageFormModal.hooks';
import { AutoEncourageForm } from '../AutoEncourageFormModal';
import { EnableRepresentativeNumber } from '_data/support/model/EnableRepresentativeNumber';

export function EncourageSMSForm() {
  const { data: userData } = useFindUser();
  const { data: enableRepresentativeNumbersData } = useFindEnableRepresentativeNumber(initRepresentativeNumberParams);

  const myName = userData?.name.ko || '';
  const myPhone = userData?.phone || '';
  const enableMainNumberOption = getEnableMainNumberOption(enableRepresentativeNumbersData?.results);

  const [isCheckedMyInfo, setIsCheckedMyInfo] = useState(true);

  const { watch, control, setValue } = useFormContext<AutoEncourageForm>();
  const [sendMediaUseSMS] = watch(['sendMediaUseSMS']);

  const { field: operatorName } = useController({
    name: 'smsFormat.operatorName',
    control,
    rules: {
      required: sendMediaUseSMS && 'SMS 발송자를 선택해주세요',
    },
    defaultValue: myName,
  });

  const { field: operatorPhone } = useController({
    name: 'smsFormat.operatorPhone',
    control,
    rules: {
      required: sendMediaUseSMS && true,
    },
    defaultValue: myPhone,
  });

  const { field: smsContents } = useController({
    name: 'smsFormat.smsContents',
    control,
    rules: {
      required: sendMediaUseSMS && 'SMS의 내용을 입력해주세요',
    },
  });

  useEffect(() => {
    if (sendMediaUseSMS && operatorName.value !== undefined && operatorName.value !== myName) {
      setIsCheckedMyInfo(false);
    }
  }, [setValue, myName, operatorName.value, sendMediaUseSMS]);

  const onCheckedMyInfo = () => {
    setIsCheckedMyInfo(true);
    operatorName.onChange(myName);
    operatorPhone.onChange(myPhone);
  };

  const onCheckedEnableInfo = () => {
    setIsCheckedMyInfo(false);
    operatorName.onChange('');
    operatorPhone.onChange('');
  };

  const onChangeOperatorEnableInfo = (_: React.FormEvent, data: DropdownProps) => {
    const name = data.value as string;
    const phone =
      find(enableRepresentativeNumbersData?.results, {
        representativeNumber: { name: data.value },
      })?.representativeNumber.phone || '';

    operatorName.onChange(name);
    operatorPhone.onChange(phone);
  };

  return (
    <Table.Row>
      <Table.Cell>SMS</Table.Cell>
      <Table.Cell>
        <Table>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                발송자
                <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Group style={{ alignItems: 'center' }}>
                  <Form.Radio
                    label={myName || ''}
                    onChange={onCheckedMyInfo}
                    checked={isCheckedMyInfo}
                    disabled={!sendMediaUseSMS}
                  />
                  <Form.Radio onChange={onCheckedEnableInfo} checked={!isCheckedMyInfo} disabled={!sendMediaUseSMS} />
                  <Select
                    style={{ marginLeft: '5px' }}
                    options={enableMainNumberOption}
                    placeholder="선택해주세요"
                    value={isCheckedMyInfo ? '' : operatorName.value}
                    onChange={onChangeOperatorEnableInfo}
                    disabled={isCheckedMyInfo}
                  />
                </Form.Group>
                {!isCheckedMyInfo && myName !== operatorName.value && !isEmpty(operatorPhone.value) && (
                  <Form.Field label={operatorPhone.value} />
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                내용
                <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <TextArea placeholder="SMS 내용을 입력해주세요." readOnly={!sendMediaUseSMS} {...smsContents} />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Table.Cell>
    </Table.Row>
  );
}

const getEnableMainNumberOption = (numbersData?: EnableRepresentativeNumber[]) => {
  if (numbersData === undefined) {
    return [{ key: '', text: 'Select', value: '없음' }];
  }

  const representativeNumberOptions = [
    {
      key: '',
      text: '선택해주세요',
      value: '',
    },
  ];

  numbersData?.forEach((option, i: number) => {
    const { representativeNumber } = option;
    representativeNumberOptions.push({
      key: i.toString(),
      text: representativeNumber.name,
      value: representativeNumber.name,
    });
  });

  return representativeNumberOptions;
};
