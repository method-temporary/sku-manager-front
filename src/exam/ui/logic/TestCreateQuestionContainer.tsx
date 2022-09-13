import React, { useEffect } from 'react';
import { Button, Form, Table } from 'semantic-ui-react';
import { CreateQuestionListView } from '../view/CreateQuestionListView';
import { useTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { onAddChoice, onAddEssay, onAddShortAnswer } from 'exam/handler/TestCreateQuestionHandler';

export function TestCreateQuestionContainer() {
  const testCreateForm = useTestCreateFormViewModel();

  return (
    <Form>
      {testCreateForm !== undefined &&
        testCreateForm.newQuestions.map((newQuestion, index) => (
          <CreateQuestionListView
            key={index}
            questionIndex={index}
            finalCopy={testCreateForm.finalCopy}
            questionSelectionType={testCreateForm.questionSelectionType}
            newQuestion={newQuestion}
          />
        ))}
    </Form>

    //   <Form>
    //   <Table celled>
    //     <Table.Header>
    //       <Table.Row>
    //         <Table.HeaderCell className="title-header">Test 문항 설정</Table.HeaderCell>
    //       </Table.Row>
    //     </Table.Header>
    //     <Table.Body>
    //       <Table.Row>
    //         <Table.Cell>
    //           {testCreateForm !== undefined &&
    //             testCreateForm.newQuestions.map((newQuestion, index) => (
    //               <CreateQuestionListView
    //                 key={index}
    //                 questionIndex={index}
    //                 finalCopy={testCreateForm.finalCopy}
    //                 questionSelectionType={testCreateForm.questionSelectionType}
    //                 newQuestion={newQuestion}
    //               />
    //             ))}
    //           {testCreateForm !== undefined && testCreateForm.newQuestions.length > 0 && <br />}
    //           {!testCreateForm?.finalCopy && (
    //             <>
    //               <Button onClick={onAddChoice}>문항 추가</Button>
    //             </>
    //           )}
    //         </Table.Cell>
    //       </Table.Row>
    //     </Table.Body>
    //   </Table>
    // </Form>
  );
}
