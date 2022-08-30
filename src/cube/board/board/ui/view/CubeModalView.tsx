import React from 'react';
import { Icon, Table, Form, Radio } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CubeWithReactiveModel } from 'cube/cube/model/sdo/CubeWithReactiveModel';

interface Props {
  cubes: CubeWithReactiveModel[];
  selectedIds: string[];
  onClickRadio: (cubeWiths: CubeWithReactiveModel, index: number) => void;
}

@reactAutobind
class CubeModalView extends React.Component<Props> {
  //
  render() {
    //
    const { cubes, selectedIds, onClickRadio } = this.props;

    return (
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
            <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">학습유형</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">category</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {cubes && cubes.length ? (
            cubes.map((cubeWiths, index: number) => {
              // const { cube, cubeContents } = cubeWiths;
              return (
                <Table.Row textAlign="center" key={index}>
                  <Table.Cell>
                    <Form.Field
                      control={Radio}
                      checked={selectedIds.includes(cubeWiths.cubeId)}
                      onClick={() => onClickRadio(cubeWiths, index)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="left">{getPolyglotToAnyString(cubeWiths.name)}</Table.Cell>
                  <Table.Cell>{cubeWiths.type}</Table.Cell>
                  <Table.Cell>{cubeWiths.categories[0].channelId /*displayChannel(card)*/}</Table.Cell>
                  <Table.Cell>{moment(cubeWiths.registeredTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
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
    );
  }
}

export default CubeModalView;
