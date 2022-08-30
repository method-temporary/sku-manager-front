import * as React from 'react';
import moment from 'moment';
import { Breadcrumb, Button, Container, Grid, Header, Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SubActions } from 'shared/components';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import BadgeWithStudentCountRomModel from '../../../../../_data/badge/badges/model/BadgeWithStudentCountRomModel';
import ChartTreeViewModel from '../../model/ChartTreeViewModel';

interface Props {
  handleSaveButtonClick: () => void;
  handleUpDownButtonClick: (badge: BadgeWithStudentCountRomModel, oldSeq: number, newSeq: number) => void;
  badges: BadgeWithStudentCountRomModel[];
  selectedCategoryName: string;
  categoriesMap: Map<string, string>;
  userWorkspaceMap: Map<string, string>;
  routeToBadgeDetail: (badgeId: string) => void;
  arrangeTree?: ChartTreeViewModel[];
}

@observer
@reactAutobind
export default class BadgeArrangeManagementListView extends ReactComponent<Props> {
  //
  render() {
    //
    const {
      handleSaveButtonClick,
      handleUpDownButtonClick,
      badges,
      selectedCategoryName,
      categoriesMap,
      userWorkspaceMap,
      routeToBadgeDetail,
      arrangeTree,
    } = this.props;

    return (
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.badgeArrangeSections} />
          <Header as="h2">Badge 편성 관리</Header>
        </div>
        {(arrangeTree && arrangeTree.length && arrangeTree[0].nodes.length && (
          <>
            <Grid className="list-info">
              <Grid.Row>
                <Grid.Column width={8}>
                  <span>
                    <strong>{selectedCategoryName} </strong>분야에 총 <strong>{badges.length}개</strong>의 Badge가
                    등록되어 있습니다.
                  </span>
                </Grid.Column>
                <Grid.Column width={8}>
                  <div className="right">
                    <Button onClick={handleSaveButtonClick}>편성기능 저장</Button>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Table celled selectable>
              <colgroup>
                <col width="14%" />
                <col />
                <col width="9%" />
                <col width="9%" />
                <col width="9%" />
                <col width="8%" />
                <col width="8%" />
                <col width="8%" />
                <col width="9%" />
                <col width="9%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">순서</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Badge명</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">인증관리주체</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">분야</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">유형</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">레벨</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">승인일자</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Badge획득인원</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">도전중인원</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {(badges &&
                  badges.length &&
                  badges.map((badge, index) => (
                    <Table.Row key={index} onClick={() => routeToBadgeDetail(badge.id)}>
                      <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
                        <span className="num">{index + 1}</span>
                        {badges.length > 1 && badges[index].id !== '' ? (
                          <div className="action-btn-group">
                            <Button
                              icon="angle down"
                              size="mini"
                              basic
                              onClick={() => handleUpDownButtonClick(badge, index, index + 1)}
                              disabled={index + 1 === badges.length}
                            />
                            <Button
                              icon="angle up"
                              size="mini"
                              basic
                              onClick={() => handleUpDownButtonClick(badge, index, index - 1)}
                              disabled={index === 0}
                            />
                          </div>
                        ) : null}
                      </Table.Cell>
                      <Table.Cell>
                        {getPolyglotToAnyString(badge.name, getDefaultLanguage(badge.langSupports))}
                      </Table.Cell>
                      <Table.Cell>{userWorkspaceMap.get(badge.cineroomId)}</Table.Cell>
                      <Table.Cell>{categoriesMap.get(badge.categoryId)}</Table.Cell>
                      <Table.Cell>{badge.type}</Table.Cell>
                      <Table.Cell>{badge.level}</Table.Cell>
                      <Table.Cell>
                        {getPolyglotToAnyString(badge.registrantName, getDefaultLanguage(badge.langSupports))}
                      </Table.Cell>
                      <Table.Cell>{moment(badge.registeredTime).format('YY.MM.DD')}</Table.Cell>
                      <Table.Cell textAlign="center">{badge.issuedCount} 명</Table.Cell>
                      <Table.Cell textAlign="center">{badge.challengingCount} 명</Table.Cell>
                    </Table.Row>
                  ))) || (
                  <Table.Row>
                    <Table.Cell textAlign="center" colSpan={10}>
                      <div className="no-cont-wrap no-contents-icon">
                        <Icon className="no-contents80" />
                        <div className="text">등록된 Badge 편성이 없습니다.</div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </>
        )) || (
          <SubActions>
            <SubActions.Left>등록된 Badge 분야가 없습니다.</SubActions.Left>
          </SubActions>
        )}
      </Container>
    );
  }
}
