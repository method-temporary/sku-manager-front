import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { booleanToYesNo } from 'shared/helper';

import { BadgeWithStudentCountRomModel } from '_data/badge/badges/model';

interface Props {
  isUpdatable: boolean;
  relatedBadges: BadgeWithStudentCountRomModel[];
  onClickRelatedBadgeDelete: (index: number) => void;
  onClickRelatedBadgeSorting: (model: BadgeWithStudentCountRomModel, oldSeq: number, newSeq: number) => void;
  cineroomsMap: Map<string, string>;
  badgeCategoryMap: Map<string, string>;
}

class BadgeLearningInfoSelectBadgeListView extends React.Component<Props> {
  //
  render() {
    //
    const {
      relatedBadges,
      isUpdatable,
      onClickRelatedBadgeDelete,
      onClickRelatedBadgeSorting,
      cineroomsMap,
      badgeCategoryMap,
    } = this.props;

    return (
      <Table celled>
        <Table.Body>
          <Table.Row textAlign="center">
            <Table.Cell>
              <Table celled>
                <colgroup>
                  {isUpdatable && (
                    <>
                      <col width="7%" />
                      <col width="9%" />
                    </>
                  )}
                  <col width="5%" />
                  <col />
                  <col width="10%" />
                  <col width="10%" />
                  <col width="10%" />
                  <col width="10%" />
                  <col width="5%" />
                  <col width="5%" />
                  <col width="20%" />
                </colgroup>
                <Table.Header>
                  <Table.Row className="title-header" textAlign="center">
                    {isUpdatable && (
                      <>
                        <Table.HeaderCell className="title-header" />
                        <Table.HeaderCell className="title-header">순서변경</Table.HeaderCell>
                      </>
                    )}
                    <Table.HeaderCell className="title-header">순서</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">Badge명</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">사용처</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">분야</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">유형</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">레벨</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">생성자</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">생성일</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">추가발급 여부</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {relatedBadges &&
                  relatedBadges.map((badge, index) => (
                    <Table.Body key={index}>
                      <Table.Row textAlign="center" key={badge.id}>
                        {isUpdatable && (
                          <>
                            <Table.Cell>
                              <Button icon size="mini" basic onClick={() => onClickRelatedBadgeDelete(index)}>
                                <Icon name="minus" />
                              </Button>
                            </Table.Cell>
                            <Table.Cell>
                              <Button
                                icon
                                size="mini"
                                basic
                                disabled={index === relatedBadges.length - 1}
                                onClick={() => onClickRelatedBadgeSorting(badge, index, index + 1)}
                              >
                                <Icon name="angle down" />
                              </Button>
                              <Button
                                icon
                                size="mini"
                                basic
                                disabled={index === 0}
                                onClick={() => onClickRelatedBadgeSorting(badge, index, index - 1)}
                              >
                                <Icon name="angle up" />
                              </Button>
                            </Table.Cell>
                          </>
                        )}
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{getPolyglotToAnyString(badge.name)}</Table.Cell>
                        <Table.Cell>{cineroomsMap.get(badge.cineroomId)}</Table.Cell>
                        <Table.Cell>{badgeCategoryMap.get(badge.categoryId)}</Table.Cell>
                        <Table.Cell>{badge.type}</Table.Cell>
                        <Table.Cell>{badge.level}</Table.Cell>
                        <Table.Cell>{getPolyglotToAnyString(badge.registrantName)}</Table.Cell>
                        <Table.Cell>{moment(badge.registeredTime).format('YY.MM.DD')}</Table.Cell>
                        <Table.Cell>{booleanToYesNo(badge.additionalRequirementsNeeded)}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default BadgeLearningInfoSelectBadgeListView;
