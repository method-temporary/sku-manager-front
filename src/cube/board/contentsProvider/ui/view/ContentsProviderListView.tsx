import React from 'react';
import { Breadcrumb, Container, Header, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { SharedService } from 'shared/present';
import { Pagination, SubActions } from 'shared/components';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { OffsetElementList, SelectType } from 'shared/model';
import { SearchBox, SearchBoxFieldView } from 'shared/ui';

import { ContentsProviderQueryModel } from '../../model/ContentsProviderQueryModel';
import ContentsProviderWithCubeCountRom from '../../model/ContentsProviderWithCubeCountRom';

interface ContentsProviderListViewProps {
  searchQuery: () => void;
  contentsProviderQueryModel: ContentsProviderQueryModel;
  routeToContentsProviderCreate: () => void;
  changeContentsProviderQueryProps: (name: string, value: any) => void;
  clearContentsProviderQuery: () => void;
  contentsProviderList: OffsetElementList<ContentsProviderWithCubeCountRom>;
  routeToContentsProviderDetail: (contentsProviderId: string) => void;
  sharedService: SharedService;
}

const ContentsProviderListView: React.FC<ContentsProviderListViewProps> = function ContentsProviderListView({
  searchQuery,
  contentsProviderQueryModel,
  routeToContentsProviderCreate,
  changeContentsProviderQueryProps,
  clearContentsProviderQuery,
  contentsProviderList,
  routeToContentsProviderDetail,
  sharedService,
}) {
  const { startNo } = sharedService.getPageModel('contentsProvider');

  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={SelectType.contentsProviderSections} />
        <Header as="h2">교육기관 관리</Header>
      </div>
      <SearchBox
        onSearch={searchQuery}
        onChangeQueryProps={changeContentsProviderQueryProps}
        onClearQueryProps={clearContentsProviderQuery}
        queryModel={contentsProviderQueryModel}
        searchWordOption={SelectType.searchWordForContentsProvider}
        collegeAndChannel={false}
        defaultPeriod={2}
      >
        <SearchBoxFieldView
          fieldTitle="구분"
          fieldOption={SelectType.searchContentsProviderAreaType}
          onChangeQueryProps={changeContentsProviderQueryProps}
          targetValue={contentsProviderQueryModel.areaType || '전체'}
          queryFieldName="areaType"
        />
        <SearchBoxFieldView
          fieldTitle="활성/비활성"
          fieldOption={SelectType.searchContentsProviderUse}
          onChangeQueryProps={changeContentsProviderQueryProps}
          targetValue={contentsProviderQueryModel.enabled || '전체'}
          queryFieldName="enabled"
        />
      </SearchBox>

      <Pagination name="contentsProvider" onChange={searchQuery}>
        <SubActions>
          <SubActions.Left>
            <SubActions.Count>
              <strong>{contentsProviderList.totalCount}</strong>개 교육기관 등록
            </SubActions.Count>
          </SubActions.Left>
          <SubActions.Right>
            <Pagination.LimitSelect />
            <SubActions.CreateButton onClick={routeToContentsProviderCreate} />
          </SubActions.Right>
        </SubActions>

        <Table celled selectable>
          <colgroup>
            <col width="3%" />
            <col width="30%" />
            <col width="10%" />
            <col width="15%" />
            <col width="10%" />
            <col width="10%" />
            <col width="5%" />
            <col width="5%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">교육기관명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">등록자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">등록자 e-mail</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">구분</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">활성/비활성</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">매핑된 Cube 수</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {contentsProviderList && contentsProviderList.results.length ? (
              contentsProviderList.results.map((contentsProvider, index) => {
                return (
                  <Table.Row key={index} onClick={() => routeToContentsProviderDetail(contentsProvider.id || '')}>
                    <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {contentsProvider.name &&
                        getPolyglotToAnyString(
                          contentsProvider.name,
                          getDefaultLanguage(contentsProvider.langSupports)
                        )}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {contentsProvider.registrantName &&
                        getPolyglotToAnyString(
                          contentsProvider.registrantName,
                          getDefaultLanguage(contentsProvider.langSupports)
                        )}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{contentsProvider.creatorEmail}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {moment(contentsProvider.time).format('YYYY.MM.DD HH:mm:ss')}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{contentsProvider.areaType}</Table.Cell>
                    <Table.Cell textAlign="center">{contentsProvider.enabled ? '활성' : '비활성'}</Table.Cell>
                    <Table.Cell textAlign="center">{contentsProvider.cubeCnt}</Table.Cell>
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
        <Pagination.Navigator />
      </Pagination>
    </Container>
  );
};

export default ContentsProviderListView;
