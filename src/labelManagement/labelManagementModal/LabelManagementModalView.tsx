import React from 'react';
import { Button, Input, Modal, Table, TextArea } from 'semantic-ui-react';
import {
  onChangeModalInputCode,
  onCloseResource,
  onCloseResourcePath,
  onOpenResource,
  onOpenResourcePath,
  onChangeModalInputLabel,
  onChangeModalInputMemo,
  onConfirmResourcePath,
  onConfirmResource,
  onChangeKo,
  onChangeEn,
  onChangeZh,
  onChangeModalResourcePathCode,
} from './labelManagementModal.events';
import { InitLabelManagementModal } from './labelManagementModal.models';
import {
  useLabelResourceIsOpen,
  useLabelResourcePathIsOpen,
  useLabelManagementModalInput,
} from './labelManagementModal.services';

export function I18nReSourcePathModal() {
  const labelPathIdIsOpen = useLabelResourcePathIsOpen();
  const labelInputTable = useLabelManagementModalInput() || InitLabelManagementModal();

  return (
    <Modal
      onClose={onCloseResourcePath}
      onOpen={onOpenResourcePath}
      open={labelPathIdIsOpen}
      trigger={<Button fluid>화면 추가</Button>}
    >
      <Modal.Header>화면 추가</Modal.Header>
      <Modal.Content>
        <Table celled>
          <colgroup>
            <col width="10%" />
            <col width="90%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">코드</Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  id="name"
                  type="text"
                  placeholder="레이블 명칭에 따라 코드명을 제안드립니다. 변경을 원하시는 코드명을 3자리 이내로 직접 입력할 수 있습니다."
                  value={labelInputTable.id}
                  onChange={onChangeModalInputCode}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">레이블</Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  id="name"
                  type="text"
                  placeholder="사용하실 레이블 명칭을 입력하세요."
                  value={labelInputTable.name}
                  onChange={onChangeModalInputLabel}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">메모</Table.Cell>
              <Table.Cell>
                <TextArea rows={5} value={labelInputTable.memo} onChange={onChangeModalInputMemo} />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button color={'basic' as any} onClick={onCloseResourcePath}>
          취소
        </Button>
        <Button color={'primary' as any} onClick={onConfirmResourcePath}>
          저장
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export function I18nReSourceModal() {
  const labelPathIsOpen = useLabelResourceIsOpen();
  const labelModalInputTable = useLabelManagementModalInput() || InitLabelManagementModal();

  return (
    <Modal
      onClose={onCloseResource}
      onOpen={onOpenResource}
      open={labelPathIsOpen}
      trigger={<Button fluid>화면요소 추가</Button>}
    >
      <Modal.Header>화면 추가</Modal.Header>
      <Modal.Content>
        <Table celled>
          <colgroup>
            <col width="10%" />
            <col width="90%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="tb-header">화면 코드</Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  id="name"
                  type="text"
                  placeholder="레이블 명칭에 따라 코드명을 제안드립니다. 변경을 원하시는 코드명을 3자리 이내로 직접 입력할 수 있습니다."
                  value={labelModalInputTable.i18nResourcePathId}
                  onChange={onChangeModalResourcePathCode}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">화면요소 코드</Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  id="name"
                  type="text"
                  placeholder="레이블 명칭에 따라 코드명을 제안드립니다. 변경을 원하시는 코드명을 3자리 이내로 직접 입력할 수 있습니다."
                  value={labelModalInputTable.id}
                  onChange={onChangeModalInputCode}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">레이블</Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  id="name"
                  type="text"
                  placeholder="사용하실 레이블 명칭을 입력하세요."
                  value={labelModalInputTable.name}
                  onChange={onChangeModalInputLabel}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">국문내용</Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  id="krConents"
                  type="text"
                  value={labelModalInputTable.content?.ko || ''}
                  onChange={onChangeKo}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">영문내용</Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  id="enConents"
                  type="text"
                  value={labelModalInputTable.content?.en || ''}
                  onChange={onChangeEn}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">중문내용</Table.Cell>
              <Table.Cell>
                <Input
                  fluid
                  id="cnConents"
                  type="text"
                  value={labelModalInputTable.content?.zh || ''}
                  onChange={onChangeZh}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">메모</Table.Cell>
              <Table.Cell>
                <TextArea rows={5} value={labelModalInputTable.memo} onChange={onChangeModalInputMemo} />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button color={'basic' as any} onClick={onCloseResource}>
          취소
        </Button>
        <Button color={'primary' as any} onClick={onConfirmResource}>
          저장
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
