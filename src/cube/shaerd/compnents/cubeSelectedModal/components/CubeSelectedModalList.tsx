import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import dayjs from 'dayjs';

import { CubeType } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { displayChannel } from 'card/shared/utiles';
import { divisionCategories } from 'card/card/ui/logic/CardHelper';
import { useFindColleges } from 'college/College.hook';

import { CubeWithReactiveModel } from '../../../../cube';
import { isChecked, onSelectedCube } from '../CubeSelectedModal.util';

interface Props {
  //
  cubes: CubeWithReactiveModel[];
}

const CubeSelectedModalList = observer(({ cubes }: Props) => {
  //
  const { data: Colleges } = useFindColleges();

  return (
    <div className="scrolling-40vh">
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="40%" />
          <col width="15%" />
          <col width="20%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">선택</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Cube명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">학습유형</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">category</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {cubes && cubes.length ? (
            cubes.map((cubeWiths, index: number) => {
              const { mainCategory } = divisionCategories(cubeWiths.categories);
              return (
                <Table.Row textAlign="center" key={index}>
                  <Table.Cell>
                    <Form.Field
                      control={Checkbox}
                      checked={isChecked(cubeWiths.cubeId)}
                      onChange={(_: any, data: any) => onSelectedCube(cubeWiths, data.checked)}
                      disabled={cubeWiths.type === CubeType.ClassRoomLecture || cubeWiths.type === CubeType.ELearning}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="left">{getPolyglotToAnyString(cubeWiths.name)}</Table.Cell>
                  <Table.Cell>{cubeWiths.type}</Table.Cell>
                  <Table.Cell>{displayChannel(mainCategory, Colleges?.results)}</Table.Cell>
                  <Table.Cell>{dayjs(cubeWiths.registeredTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(cubeWiths.registrantName)}</Table.Cell>
                </Table.Row>
              );
            })
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
    </div>
  );
});

export default CubeSelectedModalList;
