import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { InstructorDetailRdo } from '_data/user/instructors/model/InstructorDetailRdo';

import { getCollegeName } from 'college/College.util';
import { useFindColleges } from 'college/College.hook';

import InstructorModalStore from '../InstructorModal.store';
import { isCheckedInstructor } from '../InstructorModal.util';

interface Props {
  instructors: InstructorDetailRdo[];
}

const InstructorModalList = observer(({ instructors }: Props) => {
  //
  const { selectedInstructors, setSelectedInstructors } = InstructorModalStore.instance;
  const { data: Colleges } = useFindColleges();

  const onCheckInstructor = (checked: boolean, selectedInstructor: InstructorDetailRdo) => {
    //
    let next = [...selectedInstructors];

    if (checked) {
      next.push(selectedInstructor);
    } else {
      next = selectedInstructors
        .filter((instructorDetail) => instructorDetail.instructor.id !== selectedInstructor.instructor.id)
        .map((instructorDetail) => instructorDetail);
    }

    setSelectedInstructors(next);
  };

  return (
    <Form>
      <Table>
        <colgroup>
          <col width="10%" />
          <col width="30%" />
          <col width="10%" />
          <col width="25%" />
          <col width="25%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
            <Table.HeaderCell>성명</Table.HeaderCell>
            <Table.HeaderCell>사내/사외</Table.HeaderCell>
            <Table.HeaderCell>소속정보</Table.HeaderCell>
            <Table.HeaderCell>카테고리</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {instructors && instructors.length > 0 ? (
            <>
              {instructors.map((instructorDetail, index: number) => {
                const { instructor, user } = instructorDetail;
                return (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">
                      <Form.Field
                        control={Checkbox}
                        value="1"
                        checked={isCheckedInstructor(instructor.id)}
                        onChange={(_: any, data: any) => onCheckInstructor(data.checked, instructorDetail)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <span className="ellipsis">{getPolyglotToAnyString(instructor.name)}</span>
                    </Table.Cell>
                    <Table.Cell textAlign="center">{instructor.internal ? '사내' : '사외'}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {getPolyglotToAnyString(
                        instructor.internal ? instructor.organization || user.departmentName : instructor.organization
                      )}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {getCollegeName(instructor.collegeId, Colleges?.results || [])}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </>
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={6}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Form>
  );
});

export default InstructorModalList;
