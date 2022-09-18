import React from 'react';
import { Button, Grid, Pagination, Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { OffsetElementList } from '@nara.platform/accent';

import { parserLanguageTextToShort } from 'shared/components/Polyglot';

import { SurveyFormModel } from '../../form/model/SurveyFormModel';
import { SurveyFormService } from '../../index';

interface Props {
  surveyFormsList: OffsetElementList<SurveyFormModel>;
  pageMap: any;
  pageIndex: number;
  changeCopySurveyModalOpen: (open: boolean) => void;
  onSelectSurveyForm: (surveyFormId: string) => void;
  copySurveyModalShow: (surveyFormId: string) => void;
  onPageChange: (activePage: number) => void;
  copySurveyModalOpen: boolean;
  surveyFormService?: SurveyFormService;
}

@observer
class SurveyFormListView extends React.Component<Props> {
  //
  render() {
    const { pageMap, surveyFormsList, pageIndex, onSelectSurveyForm, onPageChange, copySurveyModalShow } = this.props;
    const results = surveyFormsList.results;
    const totalCount = surveyFormsList.totalCount;

    return (
      <>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}></Grid.Column>
            <Grid.Column width={8}>
              <div className="fl-right">
                <Button onClick={() => onSelectSurveyForm('new')}>+ Survey 등록</Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Table celled selectable className="table-fixed">
          <colgroup>
            <col width="5%" />
            <col width="50%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Survey 제목</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">등록자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
              {/* <Table.HeaderCell textAlign="center">상태</Table.HeaderCell> */}
              <Table.HeaderCell textAlign="center">설문지복사</Table.HeaderCell>
            </Table.Row>
            {(results &&
              results.length &&
              results.map((surveyForm: SurveyFormModel, index) => {
                const language = parserLanguageTextToShort(localStorage.getItem('language') || '');

                return (
                  <Table.Row key={surveyForm.id}>
                    <Table.Cell onClick={() => onSelectSurveyForm(surveyForm.id)} textAlign="center">
                      {totalCount - index - pageIndex}
                    </Table.Cell>
                    <Table.Cell onClick={() => onSelectSurveyForm(surveyForm.id)}>
                      {(surveyForm.titles.langStringMap.get(language) &&
                        surveyForm.titles.langStringMap.get(language)) ||
                        surveyForm.title}
                    </Table.Cell>
                    <Table.Cell onClick={() => onSelectSurveyForm(surveyForm.id)}>
                      {(surveyForm.formDesigner.names.langStringMap.get(language) &&
                        surveyForm.formDesigner.names.langStringMap.get(language)) ||
                        surveyForm.formDesignerName}
                    </Table.Cell>
                    <Table.Cell onClick={() => onSelectSurveyForm(surveyForm.id)} textAlign="center">
                      {surveyForm.timeStr}
                    </Table.Cell>

                    {/* <Table.Cell onClick={() => onSelectSurveyForm(surveyForm.id)} textAlign="center">
                      {surveyForm.designStateName}
                    </Table.Cell> */}
                    <Table.Cell textAlign="center">
                      <Button onClick={() => copySurveyModalShow(surveyForm.id)}>복사</Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })) || (
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
  }
}

export default SurveyFormListView;
