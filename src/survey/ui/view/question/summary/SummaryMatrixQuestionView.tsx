import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Divider, Form, Header, Input, Tab, Table } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { MatrixQuestionItems } from '../../../../form/model/MatrixQuestionItems';
import AnswerSummaryModel from '../../../../analysis/model/AnswerSummaryModel';
import { MatrixSummaryItems } from '../../../../analysis/model/MatrixSummaryItems';
import { MatrixSummaryItem } from '../../../../analysis/model/MatrixSummaryItem';
import { Image } from 'shared/components';

interface Props {
  lang: string;
  question: QuestionModel;
  answerSummary: AnswerSummaryModel;
}

@observer
@reactAutobind
export default class SummaryMatrixQuestionView extends React.Component<Props> {
  //
  render() {
    const { question, answerSummary, lang } = this.props;

    const answerItems = question.answerItems as MatrixQuestionItems;
    const summaryItems = answerSummary.summaryItems as MatrixSummaryItems;

    return (
      <>
        <Header size="tiny">질문</Header>
        {question.getSentence(lang)}
        {question.sentencesImageUrl ? (
          <div>
            <Image src={question.sentencesImageUrl} className="img-list" />
          </div>
        ) : null}
        <Divider />
        {answerItems && answerItems.rowItems ? (
          <Table celled className="test-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                {answerItems.columnItems.map((key, columnIndex) => {
                  return (
                    <Table.HeaderCell>
                      {answerItems.columnItems[columnIndex].values.langStringMap.get(lang)}
                    </Table.HeaderCell>
                  );
                })}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {answerItems.rowItems.map((rowItem, rowIndex) => {
                return (
                  <Table.Row>
                    <Table.Cell>{answerItems.rowItems[rowIndex].values.langStringMap.get(lang)}</Table.Cell>
                    {answerItems.columnItems.map((key, columnIndex) => {
                      if (summaryItems.matrixItems) {
                        const matrixItem = summaryItems.matrixItems[rowIndex] as MatrixSummaryItem;
                        if (matrixItem !== undefined) {
                          const numberCountMap = new Map(Object.entries(matrixItem.numberCountMap));

                          if (summaryItems.matrixItems[rowIndex]) {
                            return <Table.Cell>{numberCountMap.get((columnIndex + 1).toString()) || 0}</Table.Cell>;
                          }
                        } else {
                          return <Table.Cell>0</Table.Cell>;
                        }
                      }
                      return <Table.Cell>0</Table.Cell>;
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : null}
      </>
    );
  }
}
