import React from 'react';
import dayjs from 'dayjs';
import { Button, Icon, Table } from 'semantic-ui-react';
import { GroupBasedAccessRuleModel, UserGroupRuleModel, GroupBasedAccessRule } from 'shared/model';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { getBasedAccessRuleView } from 'shared/helper';
import { CardWithContents } from 'card';
import { useCollegeUtils } from 'college/College.hook';

interface CardSelectInfoListProps {
  isUpdatable: boolean;
  cards: CardWithContents[];
  onClickCardDelete: (index: number) => void;
  onClickCardSorting: (card: CardWithContents, oldSeq: number, newSeq: number) => void;
  learningTime: number;
  groupBasedAccessRule: GroupBasedAccessRuleModel;
  userGroupMap: Map<number, UserGroupRuleModel>;
  callType: 'Badge' | 'CardBundle';
}

export function CardSelectInfoList({
  isUpdatable,
  cards,
  onClickCardDelete,
  onClickCardSorting,
  learningTime,
  groupBasedAccessRule,
  userGroupMap,
  callType,
}: CardSelectInfoListProps) {
  const { getCollegeName, getChannelName } = useCollegeUtils();

  return (
    <Table celled>
      {cards.length > 0 && (callType === 'Badge' || learningTime === 0) && (
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2}>총 {learningTime} 분 획득 가능</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      )}
      <Table.Body>
        <Table.Row textAlign="center">
          <Table.Cell>
            <Table celled>
              <colgroup>
                {isUpdatable && (
                  <>
                    <col width="9%" />
                    <col width="12%" />
                  </>
                )}
                <col width="5%" />
                <col width="10%" />
                <col width="15%" />
                <col width="12%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
                <col width="12%" />
              </colgroup>
              <Table.Header>
                <Table.Row textAlign="center">
                  {isUpdatable && (
                    <>
                      <Table.HeaderCell className="title-header" />
                      <Table.HeaderCell className="title-header">순서변경</Table.HeaderCell>
                    </>
                  )}
                  <Table.HeaderCell className="title-header">순서</Table.HeaderCell>
                  <Table.HeaderCell className="title-header">CardID</Table.HeaderCell>
                  <Table.HeaderCell className="title-header">Card명</Table.HeaderCell>
                  <Table.HeaderCell className="title-header">Channel</Table.HeaderCell>
                  <Table.HeaderCell className="title-header">등록일자</Table.HeaderCell>
                  <Table.HeaderCell className="title-header">생성자</Table.HeaderCell>
                  <Table.HeaderCell className="title-header">접근가능여부</Table.HeaderCell>
                  <Table.HeaderCell className="title-header">접근제어 규칙</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cards && cards.length > 0 ? (
                  cards.map((cardWiths, index) => (
                    <Table.Row textAlign="center" key={cardWiths.card.id}>
                      {isUpdatable && (
                        <>
                          <Table.Cell>
                            <Button icon size="mini" basic onClick={() => onClickCardDelete(index)}>
                              <Icon name="minus" />
                            </Button>
                          </Table.Cell>
                          <Table.Cell>
                            <Button
                              icon
                              size="mini"
                              basic
                              disabled={index === cards.length - 1}
                              onClick={() => onClickCardSorting(cardWiths, index, index + 1)}
                            >
                              <Icon name="angle down" />
                            </Button>
                            <Button
                              icon
                              size="mini"
                              basic
                              disabled={index === 0}
                              onClick={() => onClickCardSorting(cardWiths, index, index - 1)}
                            >
                              <Icon name="angle up" />
                            </Button>
                          </Table.Cell>
                        </>
                      )}
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{cardWiths.card.id}</Table.Cell>
                      <Table.Cell>
                        {getPolyglotToAnyString(cardWiths.card.name, getDefaultLanguage(cardWiths.card.langSupports))}
                      </Table.Cell>
                      <Table.Cell>
                        {cardWiths.card.categories.map((college) => {
                          if (college.mainCategory) {
                            return `${getCollegeName(college.collegeId)} > ${getChannelName(college.channelId)}`;
                          } else {
                            return null;
                          }
                        })}
                      </Table.Cell>
                      <Table.Cell>{dayjs(cardWiths.cardContents.registeredTime).format('YY.MM.DD')}</Table.Cell>
                      <Table.Cell>
                        {getPolyglotToAnyString(
                          cardWiths.cardContents.registrantName,
                          getDefaultLanguage(cardWiths.card.langSupports)
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {GroupBasedAccessRuleModel.asRuleModelForRule(cardWiths.card.groupBasedAccessRule).isAccessible(
                          new GroupBasedAccessRule(cardWiths.card.groupBasedAccessRule),
                          groupBasedAccessRule
                        )
                          ? 'Yes'
                          : 'No'}
                      </Table.Cell>
                      <Table.Cell>
                        {cardWiths.card &&
                          cardWiths.card.groupBasedAccessRule &&
                          getBasedAccessRuleView(cardWiths.card.groupBasedAccessRule, userGroupMap)}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell textAlign="center" colSpan={9}>
                      <div className="no-cont-wrap no-contents-icon">
                        <Icon className="no-contents80" />
                        <div className="sr-only">콘텐츠 없음</div>
                        <div className="text">등록된 카드가 없습니다.</div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
