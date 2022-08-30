import React from 'react';
import { Button, Container, Grid, Pagination, Select, Table, Icon, Form, Input, Segment } from 'semantic-ui-react';

import { SharedService } from 'shared/present';
import { SelectType, NaOffsetElementList } from 'shared/model';

import Survey from '../../model/Survey';
import { SurveyQueryModel } from '../../model/SurveyQueryModel';

interface SurveyListViewProps {
  searchQuery: () => void;
  surveyQueryModel: SurveyQueryModel;
  changeSurveyQueryProps: (name: string, value: any) => void;
  clearSurveyQuery: () => void;
  surveyList: NaOffsetElementList<Survey>;
  routeToSurveyDetail: (
    surveyCaseId: string,
    surveyId: string,
    commentFeedbackId: string // Master 추가 Props
  ) => void;
  sharedService: SharedService;
}

const SurveyListView: React.FC<SurveyListViewProps> = function SurveyListView({
  searchQuery,
  surveyQueryModel,
  changeSurveyQueryProps,
  clearSurveyQuery,
  surveyList,
  routeToSurveyDetail,
  sharedService,
}) {
  const totalCount = surveyList.totalCount;
  const pageIndex = surveyQueryModel.pageIndex;

  const { pageMap } = sharedService || ({} as SharedService);
  return (
    <Container fluid>
      {/* TODO 커뮤니티 search-box 별도 구현 */}
      <Segment>
        <Form className="search-box">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label>검색어</label>
                  <Form.Field
                    control={Select}
                    placeholder="Select"
                    options={SelectType.searchWordForCommunitySurveyList}
                    value={(surveyQueryModel && surveyQueryModel.searchPart) || '전체'}
                    onChange={(e: any, data: any) => changeSurveyQueryProps('searchPart', data.value)}
                  />
                  <Form.Field
                    control={Input}
                    width={16}
                    placeholder="검색어를 입력해주세요."
                    value={(surveyQueryModel && surveyQueryModel.searchWord) || ''}
                    disabled={
                      (surveyQueryModel && surveyQueryModel.searchPart === '') || surveyQueryModel.searchPart === '전체'
                    }
                    onChange={(e: any) => changeSurveyQueryProps('searchWord', e.target.value)}
                  />
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={16}>
                <div className="center">
                  <Button
                    primary
                    type="button"
                    onClick={() => {
                      searchQuery();
                      changeSurveyQueryProps('surveyInformation', '');
                    }}
                  >
                    Search
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              전체 <strong>{surveyList.totalCount}</strong>개 설문 등록
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <Select
                className="ui small-border dropdown m0"
                defaultValue={SelectType.limit[0].value}
                control={Select}
                options={SelectType.limit}
                onChange={(e: any, data: any) => changeSurveyQueryProps('limit', data.value)}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Table celled selectable>
        <colgroup>
          <col width="3%" />
          <col width="10%" />
          <col width="25%" />
          {/* <col width="5%" />
          <col width="5%" /> */}
          {/* <col width="7%" />
          <col width="10%" /> */}
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">메뉴</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">설문설명</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {/* eslint-disable */}
        <Table.Body>
          {surveyList && surveyList.results.length ? (
            surveyList.results.map((survey, index) => {
              return (
                <Table.Row
                  key={index}
                  onClick={() =>
                    routeToSurveyDetail(
                      survey.surveyCaseId || '',
                      survey.surveyId || '',
                      survey.commentFeedbackId || '' // Master 추가 Props
                    )
                  }
                >
                  <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                  <Table.Cell textAlign="center">{survey.name}</Table.Cell>
                  <Table.Cell textAlign="center">{survey.surveyInformation}</Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={8}>
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
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            {totalCount === 0 ? null : (
              <>
                <div className="center">
                  <Pagination
                    activePage={pageMap.get('survey') ? pageMap.get('survey').page : 1}
                    totalPages={pageMap.get('survey') ? pageMap.get('survey').totalPages : 1}
                    onPageChange={(e, data) => {
                      changeSurveyQueryProps('page', data.activePage);
                      searchQuery();
                    }}
                  />
                </div>
              </>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default SurveyListView;
