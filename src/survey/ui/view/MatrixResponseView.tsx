import React from 'react';
import { Table, Radio, List } from 'semantic-ui-react';
import classNames from 'classnames';
import { QuestionModel } from '../../form/model/QuestionModel';
import { MatrixQuestionItems } from '../../form/model/MatrixQuestionItems';
import Image from 'shared/components/Image';

interface Props {
  question: QuestionModel;
}

export default class MatrixResponseView extends React.Component<Props> {
  render() {
    const { question } = this.props;
    const answerItems = question.answerItems as MatrixQuestionItems;
    return (
      <List.Item as="li" key={`Q-${question.sequence.index}`}>
        <div className="ol-title">
          {question.sentence}
          {question.sentencesImageUrl ? (
            <div>
              <Image src={question.sentencesImageUrl} className="img-list" />
            </div>
          ) : null}
        </div>
        <div className="ol-answer">
          <Table celled className="test-table" style={{ marginTop: '20px' }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                {answerItems.columnItems.map((key, columnIndex) => {
                  return (
                    <Table.HeaderCell>
                      {answerItems.columnItems[columnIndex].values.langStringMap.get('ko')}
                    </Table.HeaderCell>
                  );
                })}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {answerItems.rowItems.map((rowItem, rowIndex) => {
                return (
                  <Table.Row>
                    <Table.Cell>{answerItems.rowItems[rowIndex].values.langStringMap.get('ko')}</Table.Cell>
                    {answerItems.columnItems.map((key, columnIndex) => {
                      const index = (columnIndex + 1).toString();
                      return (
                        <Table.Cell>
                          <Radio
                            className="base"
                            name={`survey_matrix_${question.sequence.toSequenceString()}_${rowIndex}`}
                            value={index}
                          />
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </List.Item>
    );
  }
}
