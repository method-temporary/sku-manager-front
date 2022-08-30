import React from 'react';
import { Button, Container, Grid, Pagination, Select, Table, Icon, Form, Segment, Input } from 'semantic-ui-react';

import { NaOffsetElementList, SelectType } from 'shared/model';
import { SharedService } from 'shared/present';

import Group from '../../model/Group';
import { GroupQueryModel } from '../../model/GroupQueryModel';

interface GroupListViewProps {
  searchQuery: () => void;
  groupQueryModel: GroupQueryModel;
  routeToGroupCreate: () => void;
  changeGroupQueryProps: (name: string, value: any) => void;
  clearGroupQuery: () => void;
  groupList: NaOffsetElementList<Group>;
  routeToGroupDetail: (groupId: string) => void;
  sharedService: SharedService;
}

const GroupListView: React.FC<GroupListViewProps> = function GroupListView({
  searchQuery,
  groupQueryModel,
  routeToGroupCreate,
  changeGroupQueryProps,
  clearGroupQuery,
  groupList,
  routeToGroupDetail,
  sharedService,
}) {
  const totalCount = groupList.totalCount;
  const pageIndex = groupQueryModel.pageIndex;

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
                    control={Input}
                    width={16}
                    placeholder="그룹명을 입력해주세요."
                    value={(groupQueryModel && groupQueryModel.searchWord) || ''}
                    onChange={(e: any) => changeGroupQueryProps('searchWord', e.target.value)}
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
                      changeGroupQueryProps('searchWord', '');
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
              전체 <strong>{groupList.totalCount}</strong>개 그룹 등록
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <Select
                className="ui small-border dropdown m0"
                defaultValue={SelectType.limit[0].value}
                control={Select}
                options={SelectType.limit}
                onChange={(e: any, data: any) => changeGroupQueryProps('limit', data.value)}
              />
              <Button type="button" onClick={routeToGroupCreate}>
                <Icon name="plus" />
                Create
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="65%" />
          <col width="30%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">그룹명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">멤버수</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {groupList && groupList.results.length ? (
            groupList.results.map((group, index) => {
              return (
                <Table.Row key={index} onClick={() => routeToGroupDetail(group.groupId || '')}>
                  <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                  <Table.Cell textAlign="center">{group.name}</Table.Cell>
                  <Table.Cell textAlign="center">{group.memberCount || 0}</Table.Cell>
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
                    activePage={pageMap.get('group') ? pageMap.get('group').page : 1}
                    totalPages={pageMap.get('group') ? pageMap.get('group').totalPages : 1}
                    onPageChange={(e, data) => {
                      changeGroupQueryProps('page', data.activePage);
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

export default GroupListView;
