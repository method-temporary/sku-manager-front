import { patronInfo } from '@nara.platform/dock';
import { onClickTestCopyCineroomIds } from 'exam/handler/TestModalHandler';
import { useTestCopyFormViewModel } from 'exam/store/TestCopyFormStore';
import React from 'react';
import { Button, ButtonProps, Checkbox, Form, Grid, InputOnChangeData, Modal, Table } from 'semantic-ui-react';
import { isSuperManager } from 'shared/ui';

interface TestCopyModalViewProps {
  title: string;
  creatorName: string;
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void;
  onClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void;
  onOk: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void;
  workspaces: { key: string; value: string; text: string }[];
}

export function TestCopyModalView({
  title,
  creatorName,
  onChangeTitle,
  onClose,
  onOk,
  workspaces,
}: TestCopyModalViewProps) {
  const checkedCineroomIds = useTestCopyFormViewModel()?.cineroomIds || [];

  return (
    <>
      <Modal.Header>시험지 복사</Modal.Header>
      <Modal.Content>
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">시험 이름</Table.Cell>
              <Table.Cell>
                <Form.Input maxLength={100} fluid onChange={onChangeTitle} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">출제자 이름</Table.Cell>
              <Table.Cell>
                <Form.Input fluid defaultValue={creatorName} disabled />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">원본 제목</Table.Cell>
              <Table.Cell>
                <Form.Input fluid defaultValue={title} disabled />
              </Table.Cell>
            </Table.Row>
            {isSuperManager() && (
              <Table.Row>
                <Table.Cell className="tb-header">멤버사 선택</Table.Cell>
                <Table.Cell>
                  <div className="scrolling-30vh">
                    <Grid columns={2} padded>
                      {workspaces.map((item) => {
                        return (
                          <Grid.Column key={item.key}>
                            <Form.Field
                              key={item.key}
                              control={Checkbox}
                              label={item.text}
                              value={item.value}
                              checked={checkedCineroomIds && checkedCineroomIds.includes(item.value)}
                              onClick={(event: any, data: any) => onClickTestCopyCineroomIds(data.value)}
                            />
                          </Grid.Column>
                        );
                      })}
                    </Grid>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button className="w190 d" onClick={onClose}>
          Cancel
        </Button>
        <Button className="w190 p" onClick={onOk}>
          OK
        </Button>
      </Modal.Actions>
    </>
  );
}
