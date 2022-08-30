import React from 'react';
import {
  Breadcrumb,
  Button,
  Container,
  Grid,
  Header,
  Pagination,
  Select,
  Table,
  Icon,
  Form,
  Input,
} from 'semantic-ui-react';
import moment from 'moment';

import { NaOffsetElementList, UserGroupRuleModel, SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { UserGroupSelectModal } from 'shared/components';
import { getBasedAccessRuleView } from 'shared/helper';
import { SearchBox, SearchBoxFieldView } from 'shared/ui';

import Community from '../../model/Community';
import { CommunityType } from 'community/community/model/CommunityType';
import { UserGroupService } from '../../../../usergroup';
import { CommunityQueryModel } from '../../model/CommunityQueryModel';

const parseCommunityType = (communityType?: CommunityType) => {
  switch (communityType) {
    case 'COHORT':
      return '폐쇄형';
    case 'SECRET':
      return '비밀형';
    default:
      return '일반형';
  }
};

interface CommunityListViewProps {
  searchQuery: () => void;
  communityQueryModel: CommunityQueryModel;
  routeToCommunityCreate: () => void;
  changeCommunityQueryProps: (name: string, value: any) => void;
  type: string;
  isOpend: string;
  field: string;
  clearCommunityQuery: () => void;
  selectField: any[];
  communityList: NaOffsetElementList<Community>;
  routeToCommunityDetail: (communityId: string) => void;
  sharedService: SharedService;
  onSaveAccessRule: (accessRoles: UserGroupRuleModel[]) => void;
  clearGroupBasedRules: () => void;
}

const CommunityListView: React.FC<CommunityListViewProps> = function CommunityListView({
  searchQuery,
  communityQueryModel,
  routeToCommunityCreate,
  changeCommunityQueryProps,
  type,
  isOpend,
  field,
  clearCommunityQuery,
  selectField,
  communityList,
  routeToCommunityDetail,
  sharedService,
  onSaveAccessRule,
  clearGroupBasedRules,
}) {
  const totalCount = communityList.totalCount;
  const pageIndex = communityQueryModel.pageIndex;

  const { pageMap } = sharedService || ({} as SharedService);
  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={SelectType.communitySections} />
        <Header as="h2">Community 관리</Header>
      </div>
      <SearchBox
        onSearch={searchQuery}
        onChangeQueryProps={changeCommunityQueryProps}
        onClearQueryProps={clearCommunityQuery}
        queryModel={communityQueryModel}
        searchWordOption={SelectType.searchWordForCommunityNotAll}
        collegeAndChannel={false}
        defaultPeriod={2}
        inLastChildren={
          <Grid.Column width={16}>
            <Form.Group inline>
              <label>접근 제어 규칙</label>
              <div className="field">
                <UserGroupSelectModal
                  multiple
                  onConfirm={onSaveAccessRule}
                  button="선택"
                  title="사용자 그룹 추가"
                  description="사용자 그룹을 선택해주세요."
                />
              </div>
              <Form.Field
                control={Input}
                width={6}
                placeholder="사용자 그룹을 선택하세요."
                value={communityQueryModel.ruleStrings}
              />
              <Button onClick={clearGroupBasedRules}>선택 취소</Button>
            </Form.Group>
          </Grid.Column>
        }
      >
        <Grid.Column width={8}>
          <Form.Group inline>
            <label>커뮤니티 유형</label>
            <Form.Field
              control={Select}
              placeholder="Select"
              options={SelectType.searchCommunityType}
              value={type || '전체'}
              onChange={(e: any, data: any) => {
                changeCommunityQueryProps('type', data.value);
                changeCommunityQueryProps('field', '전체');
              }}
            />
            {type && type == 'OPEN' ? (
              <Form.Field
                control={Select}
                placeholder="Select"
                options={selectField}
                value={field || '전체'}
                onChange={(e: any, data: any) => changeCommunityQueryProps('field', data.value)}
              />
            ) : null}
          </Form.Group>
        </Grid.Column>
        <SearchBoxFieldView
          fieldTitle="공개여부"
          fieldOption={SelectType.searchCommunityOpend}
          onChangeQueryProps={changeCommunityQueryProps}
          targetValue={isOpend || '전체'}
          queryFieldName="isOpend"
        />
      </SearchBox>
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              전체 <strong>{communityList.totalCount}</strong>개 커뮤니티 등록
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <Select
                className="ui small-border dropdown m0"
                defaultValue={SelectType.limit[0].value}
                options={SelectType.limit}
                onChange={(e: any, data: any) => changeCommunityQueryProps('limit', data.value)}
              />
              <Button type="button" onClick={routeToCommunityCreate}>
                <Icon name="plus" />
                Create
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Table celled selectable>
        <colgroup>
          <col width="3%" />
          <col width="10%" />
          <col />
          <col width="5%" />
          <col width="5%" />
          <col width="5%" />
          <col width="7%" />
          <col width="10%" />
          <col width="20%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">유형</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">커뮤니티명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">관리자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">멤버</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">공개 여부</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">접근제어규칙</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {communityList && communityList.results.length ? (
            communityList.results.map((community, index) => {
              return (
                <Table.Row key={index} onClick={() => routeToCommunityDetail(community.communityId || '')}>
                  <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                  <Table.Cell textAlign="center">{parseCommunityType(community.type)}</Table.Cell>
                  <Table.Cell textAlign="left">{community.name}</Table.Cell>
                  <Table.Cell textAlign="center">{community.creatorName}</Table.Cell>
                  <Table.Cell textAlign="center">{community.managerName}</Table.Cell>
                  <Table.Cell textAlign="center">{community.memberCount || 0}</Table.Cell>
                  <Table.Cell textAlign="center">{community.visible === '1' ? '공개' : '비공개'}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {moment(community.createdTime).format('YYYY.MM.DD HH:mm:ss')}
                  </Table.Cell>
                  <Table.Cell>
                    {community &&
                      community.groupBasedAccessRule &&
                      getBasedAccessRuleView(community.groupBasedAccessRule, UserGroupService.instance.userGroupMap)}
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={9}>
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
                    activePage={pageMap.get('community') ? pageMap.get('community').page : 1}
                    totalPages={pageMap.get('community') ? pageMap.get('community').totalPages : 1}
                    onPageChange={(e, data) => {
                      changeCommunityQueryProps('page', data.activePage);
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

export default CommunityListView;
