import React from 'react';
import { Checkbox, CheckboxProps, Table } from 'semantic-ui-react';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { observer } from 'mobx-react';
import { getItemNo } from 'shared/helper/getItemNo';
import { useFindAutoEncourageExcludedStudent } from '../exclusionManagementTab.hooks';
import ExclusionManagementTabStore from '../exclusionManagementTab.store';

export const ExclusionTable = observer(() => {
  const { offset, limit, selectedStudents, autoEncourageExcludedStudentParams, setSelectedStudents } =
    ExclusionManagementTabStore.instance;

  const { data: excludeStudent } = useFindAutoEncourageExcludedStudent(autoEncourageExcludedStudentParams);

  const isAllChecked = () => {
    if (excludeStudent) {
      const studentIds = excludeStudent.results.map((student) => student.id);

      return selectedStudents.some((studentId) => includes(studentIds, studentId));
    }
    return false;
  };

  const onChangeAllSelectedStudents = (_: React.FormEvent, data: CheckboxProps) => {
    const currentPageStudentIds = excludeStudent?.results.map((student) => student.id) || [];
    const checked = data.checked || false;

    if (checked) {
      const allStudents = new Set([...currentPageStudentIds, ...selectedStudents]);
      setSelectedStudents([...Array.from(allStudents)]);
    } else {
      const filteredStudents = selectedStudents.filter((studentId) => !currentPageStudentIds.includes(studentId));

      setSelectedStudents(filteredStudents);
    }
  };

  const onChangeSelectedStudents = (_: React.FormEvent, data: CheckboxProps) => {
    const studentId = data.id as string;
    const checked = data.checked || false;

    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      const filteredStudents = selectedStudents.filter((selectedStudentId) => selectedStudentId !== studentId);
      setSelectedStudents(filteredStudents);
    }
  };

  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.HeaderCell>
            <Checkbox checked={isAllChecked()} onChange={onChangeAllSelectedStudents} />
          </Table.HeaderCell>
          <Table.HeaderCell>No</Table.HeaderCell>
          <Table.HeaderCell>소속사</Table.HeaderCell>
          <Table.HeaderCell>소속 조직(팀)</Table.HeaderCell>
          <Table.HeaderCell>성명</Table.HeaderCell>
          <Table.HeaderCell>직책</Table.HeaderCell>
          <Table.HeaderCell>E-mail</Table.HeaderCell>
          <Table.HeaderCell>등록자</Table.HeaderCell>
          <Table.HeaderCell>등록 일시</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {excludeStudent?.results.map((excludedStudent, index) => {
            return (
              <Table.Row>
                <Table.Cell>
                  <Checkbox
                    id={excludedStudent.id}
                    checked={selectedStudents.includes(excludedStudent.id)}
                    onChange={onChangeSelectedStudents}
                  />
                </Table.Cell>
                <Table.Cell>
                  {getItemNo(excludeStudent.totalCount, offset * limit, index, excludeStudent.results.length)}
                </Table.Cell>
                <Table.Cell>{excludedStudent.companyName.ko}</Table.Cell>
                <Table.Cell>{excludedStudent.departmentName.ko}</Table.Cell>
                <Table.Cell>{excludedStudent.name.ko}</Table.Cell>
                <Table.Cell>{excludedStudent.duty}</Table.Cell>
                <Table.Cell>{excludedStudent.email}</Table.Cell>
                <Table.Cell>{excludedStudent.registrantName.ko}</Table.Cell>
                <Table.Cell>{dayjs(excludedStudent.registeredTime).format('YYYY-MM-DD HH:mm')}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
});
