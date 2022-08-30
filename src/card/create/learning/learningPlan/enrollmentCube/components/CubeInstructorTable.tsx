import React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Icon, Input, Radio, Table, TableCell } from 'semantic-ui-react';
import { InstructorWithOptional } from '../../../../../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';
import { getPolyglotToAnyString } from '../../../../../../shared/components/Polyglot';
import EnrollmentCubeStore from '../EnrollmentCube.store';

interface props {
  readonly?: boolean;
}

export const CubeInstructorTable = observer(({ readonly }: props) => {
  //
  const { instructors, setInstructor, setIsInstructorNullCheck } = EnrollmentCubeStore.instance;

  const onClickRepresented = (targetIdx: number) => {
    const newInstructors = instructors.map((instructor, index) => {
      return { ...instructor, representative: index === targetIdx, round: 1 };
    });
    setInstructor(newInstructors);
  };

  const onChangeLectureTime = (targetIdx: number, value: number) => {
    const newInstructors = instructors.map((instructor, index) => {
      return { ...instructor, lectureTime: (targetIdx === index && value) || instructor.lectureTime, round: 1 };
    });
    setInstructor(newInstructors);
  };

  const onChangeInstructorLearningTime = (targetIdx: number, value: number) => {
    const newInstructors = instructors.map((instructor, index) => {
      return {
        ...instructor,
        instructorLearningTime: (targetIdx === index && value) || instructor.instructorLearningTime,
        round: 1,
      };
    });
    setInstructor(newInstructors);
  };

  const removeInstructor = (targetIdx: number) => {
    const newInstructors = instructors.filter((_, index) => index !== targetIdx);
    setInstructor(newInstructors);

    setIsInstructorNullCheck(newInstructors.length <= 0);
  };

  return instructors.length > 0 ? (
    <Table celled>
      <colgroup>
        <>
          <col width="9%" />
          <col width="20%" />
          <col width="10%" />
          <col width="" />
          <col width="13%" />
          <col width="13%" />
          <col width="5%" />
        </>
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">대표강사 지정</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">강의시간</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">학습인정시간</Table.HeaderCell>
          {!readonly && <Table.HeaderCell textAlign="center" />}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {instructors.map((instructor: InstructorWithOptional, index) => {
          const company =
            (instructor.instructor &&
              instructor.instructor.organization &&
              getPolyglotToAnyString(instructor.instructor.organization)) ||
            (instructor.instructor.internal &&
              instructor.user &&
              instructor.user.departmentName &&
              getPolyglotToAnyString(instructor.user.departmentName)) ||
            '-';
          const name =
            (instructor.instructor &&
              instructor.instructor.name &&
              getPolyglotToAnyString(instructor.instructor.name)) ||
            '-';
          const email = (instructor.instructor && instructor.instructor.email) || '-';
          return (
            <Table.Row key={index}>
              <Table.Cell textAlign="center">
                <Form.Field
                  control={Radio}
                  // value={true}
                  checked={(instructor.representative && true) || false}
                  onChange={() => onClickRepresented(index)}
                  disabled={readonly}
                />
              </Table.Cell>
              <Table.Cell>{company}</Table.Cell>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              {instructor.instructor.internal ? (
                readonly ? (
                  <Table.Cell>{instructor.lectureTime}</Table.Cell>
                ) : (
                  <TableCell>
                    <Form.Group inline>
                      <Form.Field
                        className="inline-important"
                        control={Input}
                        value={instructor.lectureTime}
                        onChange={(e: any, data: any) => onChangeLectureTime(index, Number(data.value))}
                        type="number"
                      />
                      <p>분</p>
                    </Form.Group>
                  </TableCell>
                )
              ) : (
                <TableCell>-</TableCell>
              )}
              {instructor.instructor.internal ? (
                readonly ? (
                  <Table.Cell>{instructor.instructorLearningTime}</Table.Cell>
                ) : (
                  <TableCell>
                    <Form.Group inline>
                      <Form.Field
                        control={Input}
                        value={instructor.instructorLearningTime}
                        onChange={(e: any, data: any) => onChangeInstructorLearningTime(index, Number(data.value))}
                        type="number"
                      />
                      <p>분</p>
                    </Form.Group>
                  </TableCell>
                )
              ) : (
                <TableCell>-</TableCell>
              )}
              {readonly ? null : (
                <Table.Cell>
                  <Button size="mini" basic name={instructor.instructor.id} onClick={() => removeInstructor(index)}>
                    <Icon name="minus" />
                  </Button>
                </Table.Cell>
              )}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  ) : (
    <></>
  );
});
