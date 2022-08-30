import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardWithContents } from 'card';

interface Props {
  card: CardWithContents;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
}

@observer
@reactAutobind
class CardSelectInfoView extends React.Component<Props> {
  //
  render() {
    //
    const { card, collegesMap, channelMap } = this.props;

    return (
      <Table celled>
        <Table.Body>
          <Table.Row textAlign="center">
            <Table.Cell>
              <Table celled>
                <colgroup>
                  <col width="20%" />
                  <col width="10%" />
                  <col width="15%" />
                  <col width="15%" />
                  <col width="15%" />
                </colgroup>

                <Table.Header>
                  <Table.Row textAlign="center">
                    <Table.HeaderCell className="title-header">Card명</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">학습유형</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">Channel</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">등록일자</Table.HeaderCell>
                    <Table.HeaderCell className="title-header">생성자</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(card.card.id && (
                    <Table.Row textAlign="center" key={card.card.id}>
                      <Table.Cell>
                        {getPolyglotToAnyString(card.card.name, getDefaultLanguage(card.card.langSupports))}
                      </Table.Cell>
                      <Table.Cell>{card.card.type || ''}</Table.Cell>
                      <Table.Cell>
                        {card.card.categories.map((college: any) => {
                          if (college.mainCategory) {
                            return `${collegesMap.get(college.collegeId)} > ${channelMap.get(college.channelId)}`;
                          } else {
                            return null;
                          }
                        })}
                      </Table.Cell>
                      <Table.Cell>{moment(card.cardContents.registeredTime).format('YY.MM.DD')}</Table.Cell>
                      <Table.Cell>
                        {getPolyglotToAnyString(
                          card.cardContents.registrantName,
                          getDefaultLanguage(card.card.langSupports)
                        )}
                      </Table.Cell>
                    </Table.Row>
                  )) || (
                    <Table.Row>
                      <Table.Cell textAlign="center" colSpan={5}>
                        <div className="no-cont-wrap no-contents-icon">
                          <Icon className="no-contents80" />
                          <div className="sr-only">콘텐츠 없음</div>
                          <div className="text">선택된 카드가 없습니다.</div>
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
}

export default CardSelectInfoView;
