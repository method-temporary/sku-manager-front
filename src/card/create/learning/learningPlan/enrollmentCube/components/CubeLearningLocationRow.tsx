import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Input, Table } from 'semantic-ui-react';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { ClassroomSdo } from '../../../../../../_data/cube/model/material';

interface props {
  readonly?: boolean;
}
export const CubeLearningLocationRow = observer(({ readonly }: props) => {
  //
  const { classroomSdos, setClassroomSdos, isApplyToAllLocation, setIsApplyToAllLocation } =
    EnrollmentCubeStore.instance;

  const onChangeField = (index: number, value: string) => {
    //
    let val = value;

    if (value.length > 30) {
      //
      val = value.substring(0, 30);
    }

    const newClassrooms: ClassroomSdo[] =
      classroomSdos.map((classroom, idx) => ({
        ...classroom,
        operation: ((isApplyToAllLocation || idx === index) && { ...classroom.operation, location: val }) || {
          ...classroom.operation,
        },
      })) || [];

    setClassroomSdos(newClassrooms);
  };

  const onClickApplyButton = (value: boolean) => {
    //
    if (value) {
      const firstLocation = (classroomSdos.length > 0 && classroomSdos[0].operation.location) || '';
      const newClassrooms: ClassroomSdo[] =
        classroomSdos.map((classroomSdo) => ({
          ...classroomSdo,
          operation: { ...classroomSdo.operation, location: firstLocation },
        })) || [];
      setClassroomSdos(newClassrooms);
    } else {
      // 체크박스 해제 시 동작
      // Tip: 0번째 값을 복사하고 싶은 경우 주석 처리 / 공백 처리를 희망 시 주석 해제
      // const newClassrooms: ClassroomSdo[] =
      //   classroomSdos.map((classroomSdo, idx) => ({
      //     ...classroomSdo,
      //     operation: (idx !== 0 && { ...classroomSdo.operation, location: '' }) || { ...classroomSdo.operation },
      //   })) || [];
      // setClassroomSdos(newClassrooms);
    }
    setIsApplyToAllLocation(value);
  };

  const getRow = (index: number, classroomSdo: ClassroomSdo, isUsedCheck?: boolean) => {
    return (
      <Table.Row>
        {!isApplyToAllLocation && <Table.Cell>{`${index + 1}차수`}</Table.Cell>}
        <Table.Cell width={13}>
          {readonly ? (
            <span>{classroomSdo.operation.location}</span>
          ) : (
            <>
              <Form.Field
                control={Input}
                placeholder={'교육장소를 입력해주세요. (30자까지 입력가능)'}
                value={classroomSdo.operation.location || ''}
                onChange={(e: any, data: any) => onChangeField(index, data.value)}
                width={classroomSdos.length === 1 ? 16 : 16}
              />
            </>
          )}
        </Table.Cell>
        {isUsedCheck && (!readonly || (readonly && isApplyToAllLocation)) && (
          <Table.Cell rowSpan={classroomSdos.length}>
            <Form.Field
              control={Checkbox}
              label={'차수별 일괄 적용'}
              checked={isApplyToAllLocation}
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
        교육장소<span className="required">*</span>
      </Table.Cell>

      <Table.Cell>
        <Table celled>
          <colgroup>
            {classroomSdos.length > 1 && !isApplyToAllLocation && <col width="5%" />}
            <col />
            {(!readonly || (readonly && isApplyToAllLocation)) && <col width="15%" />}
          </colgroup>
          <Table.Body>
            {(classroomSdos.length === 1 && getRow(0, classroomSdos[0])) ||
              (classroomSdos.length > 1 && isApplyToAllLocation && getRow(0, classroomSdos[0], true)) ||
              (classroomSdos.length > 1 && classroomSdos.map((classroom, idx) => getRow(idx, classroom, idx === 0)))}
          </Table.Body>
        </Table>
      </Table.Cell>
    </Table.Row>
  );
});
