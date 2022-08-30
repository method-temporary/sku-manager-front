import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import { CubeLearningPeriodDegree } from './CubeLearningPeriodDegree';
import EnrollmentCubeStore from '../EnrollmentCube.store';

interface props {
  readonly?: boolean;
}
export const CubeLearningPeriodRow = observer(({ readonly }: props) => {
  //
  const { classroomSdos } = EnrollmentCubeStore.instance;

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        교육기간<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        <>
          <div>
            <span className="span-information">* Card에서 설정한 차수 별 교육기간이 기본으로 표시됩니다.</span>
          </div>
          <div>
            <span className="span-information">
              * Cube의 차수 별 교육기간은 Card 차수 기간 내에서 변경이 가능합니다.
            </span>
          </div>
          {classroomSdos &&
            classroomSdos.length > 0 &&
            classroomSdos.map((_, index) => <CubeLearningPeriodDegree index={index} readonly={readonly} />)}
        </>
      </Table.Cell>
    </Table.Row>
  );
});
