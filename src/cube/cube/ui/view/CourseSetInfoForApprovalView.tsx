import * as React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { CardCategory } from 'shared/model';
import { FormTable } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardWithContents } from '../../../../card';
import { CardStates } from '../../../../_data/lecture/cards/model/vo/CardStates';

interface Props {
  findCollegeName: (collegeId: string) => string | undefined;
  findChannelName: (channelId: string) => string | undefined;

  cards: CardWithContents[];
}

@observer
@reactAutobind
class CourseSetInfoForApprovalView extends ReactComponent<Props, {}> {
  //

  getMainCategory(cardCategories: CardCategory[]): CardCategory {
    let cardCategory = new CardCategory();
    cardCategories.forEach((category) => {
      if (category.mainCategory) {
        cardCategory = category;
      }
    });
    return cardCategory;
  }

  render() {
    //
    const { cards } = this.props;

    return (
      <>
        {cards &&
          cards.length &&
          cards
            .filter((cardWithContents) => cardWithContents.card.cardState === CardStates.Opened)
            .map((cardWithContents, index) => {
              //
              const collegeName = this.props.findCollegeName(
                this.getMainCategory(cardWithContents.card.categories).collegeId
              );
              const channelName = this.props.findChannelName(
                this.getMainCategory(cardWithContents.card.categories).channelId
              );

              return (
                <FormTable.Row key={index} name={`Card ${index + 1}`}>
                  <Table>
                    <colgroup>
                      <col width="35%" />
                      <col width="15%" />
                      <col width="20%" />
                      <col width="15%" />
                      <col width="15%" />
                    </colgroup>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Card명</Table.HeaderCell>
                        <Table.HeaderCell>학습유형</Table.HeaderCell>
                        <Table.HeaderCell>Channel</Table.HeaderCell>
                        <Table.HeaderCell>등록일자</Table.HeaderCell>
                        <Table.HeaderCell>생성자</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          {cardWithContents &&
                            cardWithContents.card &&
                            getPolyglotToAnyString(cardWithContents.card.name)}
                        </Table.Cell>
                        <Table.Cell>
                          {cardWithContents &&
                            cardWithContents.card &&
                            cardWithContents.card.type &&
                            cardWithContents.card.type.toString()}
                        </Table.Cell>
                        <Table.Cell>
                          {collegeName}
                          &gt;
                          {channelName}
                        </Table.Cell>
                        <Table.Cell>
                          {cardWithContents.cardContents.registeredTime &&
                            new Date(cardWithContents.cardContents.registeredTime).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          {cardWithContents.cardContents &&
                            getPolyglotToAnyString(cardWithContents.cardContents.registrantName)}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </FormTable.Row>
              );
            })}
      </>
    );
  }
}

export default CourseSetInfoForApprovalView;
