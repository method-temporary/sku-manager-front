import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { FormTable, FormTableTypes } from '../components';
import { Container, Header } from 'semantic-ui-react';

@reactAutobind
@observer
class FormTableExample extends ReactComponent {
  //
  nameProps: FormTableTypes.FieldProps['nameProps'] = {
    textAlign: 'center',
  };

  valueProps: FormTableTypes.FieldProps['valueProps'] = {
    textAlign: 'center',
  };

  render() {
    //
    return (
      <Container fluid>
        <Header size="small">기본 형태</Header>
        <FormTable title="기본 정보">
          <FormTable.Row name="사용자 그룹명" required>
            field value
          </FormTable.Row>
          <FormTable.Row name="사용처">field value</FormTable.Row>
          <FormTable.Row name="사용여부">field value</FormTable.Row>
        </FormTable>

        <Header size="small">타이틀 분리</Header>
        <FormTable title={['Title1', 'Title2']}>
          <FormTable.Row name="사용자 그룹명">field value</FormTable.Row>
          <FormTable.Row name="사용처">field value</FormTable.Row>
          <FormTable.Row name="사용여부">field value</FormTable.Row>
        </FormTable>

        <Header size="small">colWidths, props</Header>
        <FormTable colWidths={['50%', '50%']} title={['Title1', 'Title2']} titleProps={{ textAlign: 'center' }}>
          <FormTable.Row name="사용자 그룹명" nameProps={this.nameProps} valueProps={this.valueProps}>
            field value
          </FormTable.Row>
          <FormTable.Row name="사용처" nameProps={this.nameProps} valueProps={this.valueProps}>
            field value
          </FormTable.Row>
          <FormTable.Row name="사용여부" nameProps={this.nameProps} valueProps={this.valueProps}>
            field value
          </FormTable.Row>
        </FormTable>

        <Header size="small">3개 이상의 컬럼</Header>
        <FormTable
          colWidths={['20%', '40%', '40%']}
          title={['Title1', 'Title2', 'Title3']}
          titleProps={{ textAlign: 'center' }}
        >
          <FormTable.Row name="사용자 그룹명">
            <>field value 1</>
            <>field value 2</>
          </FormTable.Row>
          <FormTable.Row name="사용처">
            <>field value 1</>
            <>field value 2</>
          </FormTable.Row>
          <FormTable.Row name="사용여부">
            <>field value 1</>
            <>field value 2</>
          </FormTable.Row>
        </FormTable>
      </Container>
    );
  }
}

export default FormTableExample;
