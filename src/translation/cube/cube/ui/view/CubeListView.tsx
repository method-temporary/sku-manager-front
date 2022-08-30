import * as React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CubeWithReactiveModel } from 'cube/cube/model/sdo/CubeWithReactiveModel';

interface Props {
  routeToDetailCube: (cubeId: string) => void;
  findCollegeName: (collegeId: string) => string | undefined;
  findChannelName: (channelId: string) => string | undefined;

  cubes: CubeWithReactiveModel[];
  contentsProviders: [{ key: string; text: string; value: string }];
  startNo: number;
}

@observer
@reactAutobind
class CubeListView extends ReactComponent<Props, {}> {
  //

  render() {
    //
    const { routeToDetailCube, cubes, contentsProviders, startNo } = this.props;
    return (
      <Table celled selectable>
        <colgroup>
          <col width="6%" />
          <col />
          <col width="8%" />
          <col width="12%" />
          <col width="9%" />
          <col width="6%" />
          <col width="6%" />
          <col width="4%" />
          <col width="8%" />
          <col width="7%" />
          <col width="7%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">교육형태</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Channel</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">교육기관</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">학습인원</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">이수인원</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">별점</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사용 카드 수</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {}

          {(cubes &&
            cubes.length &&
            cubes.map((cube: CubeWithReactiveModel, index) => {
              let contentsProvider = '';
              contentsProviders.forEach((target) => {
                if (target.key === cube.organizerId) {
                  contentsProvider = target.text;
                }
              });
              const collegeName = this.props.findCollegeName(cube.getMainCategory().collegeId);
              const channelName = this.props.findChannelName(
                cube.getMainCategory().twoDepthChannelId || cube.getMainCategory().channelId
              );

              return (
                <Table.Row key={index} onClick={() => routeToDetailCube(cube.cubeId)}>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(cube.name)}</Table.Cell>
                  <Table.Cell>{cube.type}</Table.Cell>
                  <Table.Cell>
                    {collegeName}
                    {/*{cube.cube.cubeReactiveModel.category && newCube.category.college && newCube.category.college.name}*/}
                    &nbsp;&gt;&nbsp;
                    {channelName}
                    {/*{newCube.category && newCube.category.channel && newCube.category.channel.name}*/}
                  </Table.Cell>
                  <Table.Cell>{contentsProvider}</Table.Cell>
                  <Table.Cell textAlign="center">{cube.studentCount}</Table.Cell>
                  <Table.Cell textAlign="center">{cube.passedStudentCount}</Table.Cell>
                  <Table.Cell textAlign="center">★{Math.floor(cube.starCount * 10) / 10}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {moment(cube.registeredTime).format('YYYY.MM.DD  HH:mm:ss')}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{cube.usingCardCount}</Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(cube.registrantName)}</Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={11}>
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

export default CubeListView;
