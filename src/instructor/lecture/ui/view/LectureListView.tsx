import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { EnumUtil, CubeTypeView } from 'shared/ui';

import { InstructorCube } from 'cube/cube/model/sdo/InstructorCube';

interface LectureListViewProps {
  findCollegeName: (collegeId: string) => string | undefined;
  findChannelName: (channelId: string) => string | undefined;
  lectureList: InstructorCube[];
  routeToLectureDetail: (lectureId: string) => void;
  contentsProviders: [{ key: string; text: string; value: string }];
  startNo: number;
}

const LectureListView: React.FC<LectureListViewProps> = function LectureListView({
  findCollegeName,
  findChannelName,
  lectureList,
  routeToLectureDetail,
  contentsProviders,
  startNo,
}) {
  return (
    <Table celled selectable>
      <colgroup>
        <col width="3%" />
        <col width="15%" />
        <col width="10%" />
        <col width="15%" />
        <col width="9%" />
        <col width="9%" />
        <col width="9%" />
        <col width="9%" />
        <col width="9%" />
        <col width="6%" />
        <col width="9%" />
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
          <Table.HeaderCell textAlign="center">강의시간</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">인정학습시간</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">별점</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {lectureList && lectureList.length ? (
          lectureList.map((instructorCube, index) => {
            //
            let contentsProvider = '';
            contentsProviders.forEach((target) => {
              if (target.key === instructorCube.organizerId) {
                contentsProvider = target.text;
              }
            });
            const collegeName = findCollegeName(instructorCube.collegeId);
            const channelName = findChannelName(instructorCube.channelId);

            return (
              <Table.Row key={index} onClick={() => routeToLectureDetail(instructorCube.cubeId || '')}>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell textAlign="center">{getPolyglotToAnyString(instructorCube.name)}</Table.Cell>
                <Table.Cell>
                  {instructorCube && EnumUtil.getEnumValue(CubeTypeView, instructorCube.type).get(instructorCube.type)}
                </Table.Cell>
                <Table.Cell>
                  {collegeName}&nbsp;&gt;&nbsp;{channelName}
                </Table.Cell>
                <Table.Cell textAlign="center">{contentsProvider}</Table.Cell>
                <Table.Cell textAlign="center">{instructorCube.studentCount}</Table.Cell>
                <Table.Cell textAlign="center">{instructorCube.passedStudentCount}</Table.Cell>
                <Table.Cell textAlign="center">{instructorCube.lectureTime}</Table.Cell>
                <Table.Cell textAlign="center">{instructorCube.instructorLearningTime}</Table.Cell>
                <Table.Cell textAlign="center">★{instructorCube.starCount.toPrecision(2)}</Table.Cell>
                <Table.Cell textAlign="center">{moment(instructorCube.time).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
              </Table.Row>
            );
          })
        ) : (
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
};

export default LectureListView;
