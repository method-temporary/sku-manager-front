import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Input, Select, Table } from 'semantic-ui-react';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { ClassroomSdo } from '../../../../../../_data/cube/model/material';

interface props {
  readonly?: boolean;
}
export const CubeLearningChargeRow = observer(({ readonly }: props) => {
  //
  const { classroomSdos, setClassroomSdos, isApplyToCharge, setIsApplyToAllCharge } = EnrollmentCubeStore.instance;

  const getSelector = () => {
    //
    return [
      { key: true, value: true, text: '무료' },
      { key: false, value: false, text: '유료' },
    ];
  };

  const onChangeField = (index: number, value: number) => {
    //
    const newClassrooms: ClassroomSdo[] =
      classroomSdos.map((classroom, idx) => ({
        ...classroom,
        freeOfCharge: ((isApplyToCharge || idx === index) && { ...classroom.freeOfCharge, chargeAmount: value }) || {
          ...classroom.freeOfCharge,
        },
      })) || [];

    setClassroomSdos(newClassrooms);
  };

  const onChangeSelector = (index: number, value: boolean) => {
    const newClassrooms: ClassroomSdo[] =
      classroomSdos.map((classroom, idx) => ({
        ...classroom,
        freeOfCharge: ((isApplyToCharge || idx === index) && {
          ...classroom.freeOfCharge,
          freeOfCharge: value,
          chargeAmount: 0,
        }) || {
          ...classroom.freeOfCharge,
        },
      })) || [];

    setClassroomSdos(newClassrooms);
  };

  const onClickApplyButton = (value: boolean) => {
    //
    if (value) {
      const firstCheck: boolean = (classroomSdos.length > 0 && classroomSdos[0].freeOfCharge.freeOfCharge) || false;
      const firstData: number = (classroomSdos.length > 0 && classroomSdos[0].freeOfCharge.chargeAmount) || 0;
      const newClassrooms: ClassroomSdo[] =
        classroomSdos.map((classroomSdo) => ({
          ...classroomSdo,
          freeOfCharge: { ...classroomSdo.freeOfCharge, freeOfCharge: firstCheck, chargeAmount: firstData },
        })) || [];
      setClassroomSdos(newClassrooms);
    } else {
      // 체크박스 해제 시 동작
      // Tip: 0번째 값을 복사하고 싶은 경우 주석 처리 / 공백 처리를 희망 시 주석 해제
      // const newClassrooms: ClassroomSdo[] =
      //   classroomSdos.map((classroomSdo, idx) => ({
      //     ...classroomSdo,
      //     freeOfCharge: (idx !== 0 && { ...classroomSdo.freeOfCharge, freeOfCharge: true, chargeAmount: 0 }) || {
      //       ...classroomSdo.freeOfCharge,
      //     },
      //   })) || [];
      // setClassroomSdos(newClassrooms);
    }
    setIsApplyToAllCharge(value);
  };

  const getReadText = (classroom: ClassroomSdo) => {
    let result = '';
    const freeOfCharge: boolean = classroom.freeOfCharge.freeOfCharge || false;
    result +=
      getSelector().find((item: { key: boolean; value: boolean; text: string }) => item.value === freeOfCharge)?.text ||
      '-';
    const chargeAmount: number = (!freeOfCharge && classroom.freeOfCharge.chargeAmount) || 0;
    result += (!freeOfCharge && ` : ${chargeAmount}`) || '';

    return result;
  };

  const getRow = (index: number, classroomSdo: ClassroomSdo, isUsedCheck?: boolean) => {
    return (
      <Table.Row>
        {!isApplyToCharge && <Table.Cell>{`${index + 1}차수`}</Table.Cell>}
        <Table.Cell width={13}>
          {readonly ? (
            <span>{getReadText(classroomSdo)}</span>
          ) : (
            <>
              <Form.Group>
                <Form.Field
                  control={Select}
                  value={classroomSdo.freeOfCharge.freeOfCharge}
                  options={getSelector()}
                  onChange={(e: any, data: any) => onChangeSelector(index, data.value)}
                  width={3}
                />
                {!classroomSdo.freeOfCharge.freeOfCharge && (
                  <Form.Field
                    control={Input}
                    placeholder={'유료 학습일 경우 교육비를 입력해주세요.'}
                    value={classroomSdo.freeOfCharge.chargeAmount || ''}
                    onChange={(e: any, data: any) => onChangeField(index, Number(data.value))}
                    width={classroomSdos.length === 1 ? 16 : 16}
                    type="number"
                  />
                )}
              </Form.Group>
            </>
          )}
        </Table.Cell>
        {isUsedCheck && (!readonly || (readonly && isApplyToCharge)) && (
          <Table.Cell rowSpan={classroomSdos.length}>
            <Form.Field
              control={Checkbox}
              label={'차수별 일괄 적용'}
              checked={isApplyToCharge}
              onChange={(e: any, data: any) => onClickApplyButton(data.checked)}
              disabled={readonly}
            />
          </Table.Cell>
        )}
      </Table.Row>
    );
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        유/무료 여부<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        <Table celled>
          <colgroup>
            {classroomSdos.length > 1 && !isApplyToCharge && <col width="5%" />}
            <col />
            {(!readonly || (readonly && isApplyToCharge)) && <col width="15%" />}
          </colgroup>
          <Table.Body>
            {(classroomSdos.length === 1 && getRow(0, classroomSdos[0])) ||
              (classroomSdos.length > 1 && isApplyToCharge && getRow(0, classroomSdos[0], true)) ||
              (classroomSdos.length > 1 && classroomSdos.map((classroom, idx) => getRow(idx, classroom, idx === 0)))}
          </Table.Body>
        </Table>
      </Table.Cell>
    </Table.Row>
  );
});
