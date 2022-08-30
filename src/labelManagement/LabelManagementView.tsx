import React from 'react';
import { Breadcrumb, Button, Container, Grid, Header, Table } from 'semantic-ui-react';
import { onConfirm } from './labelInputTable/labelInputTable.events';
import { LabelInputTableView } from './labelInputTable/LabelInputTableView';
import { LabelTreeView } from './labelTree/LabelTreeView';

const sections = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Lang', content: '다국어 관리', link: true },
  { key: 'Label', content: '레이블 관리', active: true },
];

export function LabelManagementView() {
  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={sections} />
        <Header as="h2">레이블 관리</Header>
      </div>
      <div className="content">
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} className="title-header">
                화면요소 정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={5}>
                      <LabelTreeView />
                    </Grid.Column>
                    <LabelInputTableView />
                  </Grid.Row>
                </Grid>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <div className="btn-group">
          <div className="fl-right">
            <Button basic type="button">
              목록
            </Button>
            <Button primary type="button" onClick={onConfirm}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
