import React, { useCallback, useMemo } from 'react';
import { Button, Grid, Input, Table, TextArea } from 'semantic-ui-react';
import {
  onChangeCode,
  onChangeEn,
  onChangeKo,
  onChangeLabel,
  onChangeMemo,
  onChangeZh,
} from './labelInputTable.events';
import { useLabelInputTable } from './labelInputTable.services';

export function LabelInputTableView() {
  const labelInputTable = useLabelInputTable();

  if (labelInputTable === undefined) {
    return null;
  }
  const { id, name, content, memo, isParent, i18nResourcePathId } = labelInputTable;

  return (
    <Grid.Column width={11}>
      <Table celled>
        <colgroup>
          <col width="10%" />
          <col width="90%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">경로</Table.Cell>
            <Table.Cell>
              {isParent ? (
                <span>{id}</span>
              ) : (
                <span>
                  {i18nResourcePathId} &gt; {name}
                </span>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">코드</Table.Cell>
            <Table.Cell>
              <span>{id}</span>
              {/* <Input
                fluid
                id="name"
                type="text"
                placeholder="레이블 명칭에 따라 코드명을 제안드립니다. 변경을 원하시는 코드명을 3자리 이내로 직접 입력할 수 있습니다."
                value={id}
                onChange={onChangeCode}
              /> */}
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
                value={name}
                onChange={onChangeLabel}
              />
            </Table.Cell>
          </Table.Row>
          {!isParent && (
            <>
              <Table.Row>
                <Table.Cell className="tb-header">국문내용</Table.Cell>
                <Table.Cell>
                  <Input fluid id="krConents" type="text" value={content?.ko || ''} onChange={onChangeKo} />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">영문내용</Table.Cell>
                <Table.Cell>
                  <Input fluid id="enConents" type="text" value={content?.en || ''} onChange={onChangeEn} />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">중문내용</Table.Cell>
                <Table.Cell>
                  <Input fluid id="cnConents" type="text" value={content?.zh || ''} onChange={onChangeZh} />
                </Table.Cell>
              </Table.Row>
            </>
          )}
          <Table.Row>
            <Table.Cell className="tb-header">메모</Table.Cell>
            <Table.Cell>
              <TextArea rows={5} value={memo} onChange={onChangeMemo} />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
