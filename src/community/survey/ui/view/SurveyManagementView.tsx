import React from 'react';
import { Button, Container, Grid, Pagination, Select, Table, Icon, Form, Segment, Input } from 'semantic-ui-react';
import { SelectType, NaOffsetElementList } from 'shared/model';
import { SharedService } from 'shared/present';
import { AnswerSheetModal } from 'survey';
import Member from 'community/survey/model/Member';
import { SurveyMemberQueryModel } from '../../model/SurveyMemberQueryModel';

interface SurveyManagementViewProps {
  searchQuery: () => void;
  surveyMemberQueryModel: SurveyMemberQueryModel;
  changeSurveyMemberQueryProps: (name: string, value: any) => void;
  clearSurveyMemberQuery: () => void;
  surveyList: NaOffsetElementList<Member>;
  sharedService: SharedService;
  surveyFormId: string;
  surveyCaseId: string;
}

const SurveyManagementView: React.FC<SurveyManagementViewProps> = function SurveyManagementView({
  searchQuery,
  surveyMemberQueryModel,
  changeSurveyMemberQueryProps,
  clearSurveyMemberQuery,
  surveyList,
  sharedService,
  surveyFormId,
  surveyCaseId,
}) {
  const totalCount = surveyList.totalCount;
  const pageIndex = surveyMemberQueryModel.pageIndex;

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
                    options={SelectType.searchWordForCommunitySurveyMemberList}
                    value={(surveyMemberQueryModel && surveyMemberQueryModel.searchPart) || '전체'}
                    onChange={(e: any, data: any) => changeSurveyMemberQueryProps('searchPart', data.value)}
                  />
                  <Form.Field
                    control={Input}
                    width={16}
                    placeholder="검색어를 입력해주세요."
                    value={(surveyMemberQueryModel && surveyMemberQueryModel.searchWord) || ''}
                    disabled={
                      (surveyMemberQueryModel && surveyMemberQueryModel.searchPart === '') ||
                      surveyMemberQueryModel.searchPart === '전체'
                    }
                    onChange={(e: any) => changeSurveyMemberQueryProps('searchWord', e.target.value)}
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
                      changeSurveyMemberQueryProps('surveyInformation', '');
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
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell>소속사</Table.HeaderCell>
            <Table.HeaderCell>소속조직(팀)</Table.HeaderCell>
            <Table.HeaderCell>성명</Table.HeaderCell>
            <Table.HeaderCell>E-mail</Table.HeaderCell>
            <Table.HeaderCell>설문결과</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {surveyList && surveyList.results.length ? (
            surveyList.results.map((result, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                  <Table.Cell>{result.companyName}</Table.Cell>
                  <Table.Cell>{result.teamName}</Table.Cell>
                  <Table.Cell>{result.name}</Table.Cell>
                  <Table.Cell>{result.email}</Table.Cell>
                  <Table.Cell>
                    <AnswerSheetModal
                      trigger={<a style={{ cursor: 'pointer' }}>보기</a>}
                      surveyCaseId={surveyCaseId}
                      surveyId={surveyFormId}
                      denizenKey={result.memberId || ''}
                      // denizenKey="ddd"
                    />
                  </Table.Cell>
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
      <div className="center">
        <Pagination
          activePage={pageMap.get('surveyManagement') ? pageMap.get('surveyManagement').page : 1}
          totalPages={pageMap.get('surveyManagement') ? pageMap.get('surveyManagement').totalPages : 1}
          onPageChange={(e, data) => {
            changeSurveyMemberQueryProps('page', data.activePage);
            searchQuery();
          }}
        />
      </div>
    </Container>
  );
};

export default SurveyManagementView;
