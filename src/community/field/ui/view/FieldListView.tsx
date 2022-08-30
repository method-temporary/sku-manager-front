import React, { useCallback } from 'react';
import { Button, Icon, Table, Input, Header, Breadcrumb, Segment, Container, List } from 'semantic-ui-react';

import { SelectType } from 'shared/model';
import { AlertWin } from 'shared/ui';

import Field from '../../model/Field';
import { findFieldByTitle } from '../../api/FieldApi';

interface FieldListViewProps {
  results: Field[];
  empty: boolean;
  addRow: () => void;
  deleteRow: (id: string) => void;
  upRow: (id: string) => void;
  downRow: (id: string) => void;
  saveRow: (id: string) => void;
  editRow: (id: string) => void;
  saveOrder: () => void;
  editedId?: string;
  changeTitle?: (e: any, e1: any) => void;
  existCommunityRow: (id: string) => Promise<boolean>;
}

interface FieldListItemProps {
  id: string;
  title?: string;
  deleteRow: (id: string) => void;
  upRow: (id: string) => void;
  downRow: (id: string) => void;
  saveRow: (id: string) => void;
  editRow: (id: string) => void;
  editedId?: string;
  changeTitle?: (e: any, e1: any) => void;
}

const FieldListItem: React.FC<FieldListItemProps> = function FieldListItem({
  id,
  title,
  deleteRow,
  upRow,
  downRow,
  saveRow,
  editRow,
  editedId,
  changeTitle,
}) {
  const isEditing = id === editedId;
  return (
    <Table.Row key={id}>
      <Table.Cell textAlign="left">
        {editedId !== id ? (
          <span>{title}</span>
        ) : (
          <Input placeholder="분야명을 입력해주세요." value={title} onChange={changeTitle} />
        )}
      </Table.Cell>
      <Table.Cell textAlign="center">
        {editedId !== id && (
          <Button onClick={() => deleteRow(id)}>
            <Icon name="minus" fitted />
          </Button>
        )}

        {editedId !== id && <Button onClick={() => editRow(id)}>수정</Button>}
        {editedId === id && (
          <>
            <Button onClick={() => editRow('')}>취소</Button>
            <Button onClick={() => saveRow(id)}>저장</Button>
          </>
        )}
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Button onClick={() => downRow(id)}>
          <Icon name="angle down" fitted active="false" />
        </Button>
        <Button onClick={() => upRow(id)}>
          <Icon name="angle up" fitted active="false" />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

const FieldListView: React.FC<FieldListViewProps> = function FieldListView({
  results,
  deleteRow,
  upRow,
  downRow,
  saveRow,
  editRow,
  addRow,
  saveOrder,
  editedId,
  changeTitle,
  existCommunityRow,
}) {
  const [alertWin, setAlertWin] = React.useState<{
    alertMessage: string;
    alertWinOpen: boolean;
    alertTitle: string;
    alertIcon: string;
    alertType: string;
  }>({
    alertMessage: '저장 하시겠습니까?',
    alertWinOpen: false,
    alertTitle: '저장 안내',
    alertIcon: 'circle',
    alertType: 'save',
  });

  const [currentFieldId, setCurrentFieldId] = React.useState<string>('null');

  const handleCloseAlertWin = useCallback(() => {
    setCurrentFieldId('null');
    setAlertWin({ ...alertWin, alertWinOpen: false });
  }, [setAlertWin]);

  const deleteHandleOKConfirmWin = useCallback(() => {
    setAlertWin({ ...alertWin, alertWinOpen: false });
    deleteRow(currentFieldId);
    setCurrentFieldId('null');
  }, [deleteRow, setAlertWin, currentFieldId]);

  const handleAlertOk = useCallback(
    (type: string) => {
      if (type === 'justOk') handleCloseAlertWin();
      if (type === 'remove') deleteHandleOKConfirmWin();
      if (type === 'saveOrder') {
        saveOrder();
        handleCloseAlertWin();
      }
    },
    [handleCloseAlertWin, deleteHandleOKConfirmWin]
  );

  const beforeSaveRow = useCallback(
    (id: string) => {
      const field = results.find((c) => c.id === id);
      if (field === undefined || field.title === '') {
        setAlertWin({
          alertMessage: '분야명을 입력해주세요.',
          alertWinOpen: true,
          alertTitle: '필수 정보 입력 안내',
          alertIcon: 'triangle',
          alertType: 'justOk',
        });
      } else {
        findFieldByTitle(encodeURI(field.title)).then((response) => {
          if (response) {
            setAlertWin({
              alertMessage: '분야명이 중복되었습니다.',
              alertWinOpen: true,
              alertTitle: '분야명 중복등록 안내',
              alertIcon: 'circle',
              alertType: 'justOk',
            });
          } else {
            saveRow(id);
          }
        });
      }
    },
    [saveRow, setAlertWin]
  );

  const beforeDeleteRow = useCallback(
    (id: string) => {
      const existCommunity = existCommunityRow(id);
      if (id != '') {
        existCommunity.then((response) => {
          if (response) {
            setAlertWin({
              alertMessage: '매핑된 Community 정보가 존재합니다.',
              alertWinOpen: true,
              alertTitle: '삭제 불가 안내',
              alertIcon: 'triangle',
              alertType: 'justOk',
            });
          } else {
            setCurrentFieldId(id);
            setAlertWin({
              alertMessage: '삭제 하시겠습니까?',
              alertWinOpen: true,
              alertTitle: '삭제 안내',
              alertIcon: 'circle',
              alertType: 'remove',
            });
            //deleteRow(id);
          }
        });
      } else {
        deleteRow(id);
      }
    },
    [existCommunityRow, deleteRow, setAlertWin]
  );

  return (
    <>
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.pathForCommunityField} />
          <Header as="h2">분야관리</Header>
        </div>
        <Segment className="info-box">
          <List bulleted>
            <List.Item>Open Community 내 제공되는 분야에 대해 생성/수정/삭제가 가능합니다.</List.Item>
            <List.Item>카테고리 생성시 Front에 반영됩니다.</List.Item>
            <List.Item style={{ color: 'red' }}>
              분야에 매핑되어 있는 Open Community가 없을 경우만 삭제가 가능합니다.
            </List.Item>
          </List>
        </Segment>
        <Table celled selectable>
          <colgroup>
            <col />
            <col width="180" />
            <col width="180" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>분야명</Table.HeaderCell>
              <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              <Table.HeaderCell>&nbsp;</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {results.map((field) => (
              <FieldListItem
                key={field.id}
                {...field}
                deleteRow={beforeDeleteRow}
                saveRow={beforeSaveRow}
                editRow={editRow}
                downRow={downRow}
                upRow={upRow}
                editedId={editedId}
                changeTitle={changeTitle}
              />
            ))}
          </Table.Body>
        </Table>
        <Segment basic textAlign="center" className="no-boarder">
          <Button onClick={addRow}>
            <Icon name="plus" fitted />
          </Button>
        </Segment>
        <Segment basic floated="right" className="no-boarder">
          <Button
            onClick={() => {
              setAlertWin({
                alertMessage: '커뮤니티 분야 순서를 저장하시겠습니까?',
                alertWinOpen: true,
                alertTitle: '커뮤니티 분야 순서 저장',
                alertIcon: 'triangle',
                alertType: 'saveOrder',
              });
            }}
          >
            순서저장
          </Button>
        </Segment>
      </Container>

      <AlertWin
        message={alertWin.alertMessage}
        handleClose={handleCloseAlertWin}
        open={alertWin.alertWinOpen}
        alertIcon={alertWin.alertIcon}
        title={alertWin.alertTitle}
        type={alertWin.alertType}
        handleOk={handleAlertOk}
      />
    </>
  );
};

export default FieldListView;
