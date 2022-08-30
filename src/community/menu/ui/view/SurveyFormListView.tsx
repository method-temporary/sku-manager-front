import React from 'react';
import { OffsetElementList } from '@nara.platform/accent';
import { Button, Pagination, Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { SurveyFormModel } from '../../../../survey/form/model/SurveyFormModel';

interface Props {
  results: SurveyFormModel[];
  totalCount: number;
  pageMap: any;
  pageIndex: number;
  onPageChange: (activePage: number) => void;
  onSelect: (id: string, title: string, creatorName: string) => void;
}

const SurveyFormListView: React.FC<Props> = function SurveyFormListView({
  pageMap,
  results,
  totalCount,
  pageIndex,
  onPageChange,
  onSelect,
}) {
  return (
    <>
      <Table celled selectable className="table-fixed">
        <colgroup>
          <col width="10%" />
          <col width="45%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">제목</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">상태</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">설문 선택</Table.HeaderCell>
          </Table.Row>
          {(results &&
            results.length &&
            results.map((surveyForm: SurveyFormModel, index) => {
              return (
                <Table.Row key={surveyForm.id}>
                  <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                  <Table.Cell>{surveyForm.title}</Table.Cell>
                  <Table.Cell textAlign="center">{surveyForm.timeStr}</Table.Cell>
                  <Table.Cell>{surveyForm.formDesignerName}</Table.Cell>
                  <Table.Cell textAlign="center">{surveyForm.designStateName}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button onClick={() => onSelect(surveyForm.id, surveyForm.title, surveyForm.formDesignerName)}>
                      선택
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={7}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Header>
      </Table>

      {pageMap && (
        <div className="center">
          <Pagination
            activePage={pageMap.get('surveyForms') ? pageMap.get('surveyForms').page : 1}
            totalPages={pageMap.get('surveyForms') ? pageMap.get('surveyForms').totalPages : 1}
            onPageChange={(e, { activePage }) => onPageChange(activePage as number)}
          />
        </div>
      )}
    </>
  );
};

export default SurveyFormListView;
