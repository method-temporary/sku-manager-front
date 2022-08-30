import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
// import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataMetaCardModel from 'dataSearch/metaCard/model/DataMetaCardModel';

interface Props {
  metaCards: DataMetaCardModel[];
  startNo: number;
}

class DataMetaCardListView extends React.Component<Props> {
  render() {
    const { metaCards, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="8%" />
          <col width="8%" />
          <col width="7%" />
          <col width="7%" />
          <col width="5%" />
          <col width="5%" />
          <col width="6%" />
          <col width="7%" />
          {/* <col width="5%" />
          <col width="5%" />
          <col width="6%" /> */}
          <col width="5%" />
          {/* <col width="7%" />
          <col width="7%" />
          <col width="7%" /> */}
          <col width="7%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>컬리지명</Table.HeaderCell>
            <Table.HeaderCell>채널명</Table.HeaderCell>
            <Table.HeaderCell>Card명</Table.HeaderCell>
            <Table.HeaderCell>메인 카테고리 여부</Table.HeaderCell>
            <Table.HeaderCell>Card Type</Table.HeaderCell>
            <Table.HeaderCell>공개여부</Table.HeaderCell>
            <Table.HeaderCell>난이도</Table.HeaderCell>
            <Table.HeaderCell>학습시간</Table.HeaderCell>
            <Table.HeaderCell>추가 학습 시간</Table.HeaderCell>
            {/* <Table.HeaderCell>Stamp 부여</Table.HeaderCell> */}
            {/* <Table.HeaderCell>모든 회원 권한 부여 여부</Table.HeaderCell> */}
            {/* <Table.HeaderCell>Tags</Table.HeaderCell> */}
            <Table.HeaderCell>교육기간</Table.HeaderCell>
            {/* <Table.HeaderCell>시험여부</Table.HeaderCell>
            <Table.HeaderCell>레포트여부</Table.HeaderCell>
            <Table.HeaderCell>설문여부</Table.HeaderCell> */}
            <Table.HeaderCell>생성일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {metaCards && metaCards.length ? (
            metaCards.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.collegeName}</Table.Cell>
                  <Table.Cell>{dataModel.channelName}</Table.Cell>
                  <Table.Cell>{dataModel.cardId}</Table.Cell>
                  <Table.Cell>{dataModel.mainCategory}</Table.Cell>
                  <Table.Cell>{dataModel.cardType}</Table.Cell>
                  <Table.Cell>{dataModel.searchable}</Table.Cell>
                  <Table.Cell>{dataModel.difficultyLevel}</Table.Cell>
                  <Table.Cell>{dataModel.learningTime}</Table.Cell>
                  <Table.Cell>{dataModel.additionalLearningTime}</Table.Cell>
                  {/* <Table.Cell>{dataModel.useStamp}</Table.Cell> */}
                  {/* <Table.Cell>{dataModel.useWhitelistPolicy}</Table.Cell> */}
                  {/* <Table.Cell>{dataModel.tags}</Table.Cell> */}
                  <Table.Cell>{dataModel.learningDate}</Table.Cell>
                  {/* <Table.Cell>{dataModel.useTests}</Table.Cell>
                  <Table.Cell>{dataModel.useReport}</Table.Cell>
                  <Table.Cell>{dataModel.useSurvey}</Table.Cell> */}
                  <Table.Cell>{dataModel.cardStateModifiedTime}</Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={15}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과가 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default DataMetaCardListView;
