import React from 'react';
import { Table } from 'semantic-ui-react';


interface ObtainedScoreViewProps {
  choiceScore: number;
  answerScore: number;
  totalScore: number;
}

export function ObtainedScoreView({
  choiceScore,
  answerScore,
  totalScore,
}: ObtainedScoreViewProps) {

  return (
    <div>
      <span>점수 합계</span>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>객관식 합계</Table.HeaderCell>
            <Table.HeaderCell>주관식 합계</Table.HeaderCell>
            <Table.HeaderCell>총 합계</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{choiceScore}</Table.Cell>
            <Table.Cell>{answerScore}</Table.Cell>
            <Table.Cell>{totalScore}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}