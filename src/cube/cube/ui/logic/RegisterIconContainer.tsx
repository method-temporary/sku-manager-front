import React from 'react';
import { Container, Divider, Header, Select } from 'semantic-ui-react';
import { FileBox, ImageBox, PatronType, ValidationType } from '@nara.drama/depot';
import { SelectType } from 'shared/model';
import { DepotUtil } from 'shared/ui';

class RegisterIconContainer extends React.Component {
  state = {
    tinyAlbumId: '',
    collegeDepotId: '',
  };

  handleChange(fileBoxId: string) {}

  changeCollegeDepotId(collegeDepotId: string) {
    this.setState({ collegeDepotId });
  }

  render() {
    return (
      <Container style={{ marginTop: '100px' }}>
        <Divider />
        <Header as="h2">Full Option FileBox</Header>
        <Select
          options={SelectType.colleges}
          value={this.state.collegeDepotId}
          onChange={(e: any, data: any) => this.changeCollegeDepotId(data.value)}
        />
        <FileBox
          id={this.state.collegeDepotId}
          vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
          patronKey={{ keyString: 'sampleDenizen', patronType: PatronType.Denizen }}
          validations={[{ type: ValidationType.Duplication, validator: DepotUtil.duplicationValidator }]}
          options={{ title: '파일을 등록해주세요.', useMyDrive: true }}
          onChange={this.handleChange}
        />

        <Divider />
        <Header as="h2">Uploadable ImageBox</Header>
        <ImageBox
          id={this.state.collegeDepotId}
          vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
          patronKey={{ keyString: 'sampleDenizen', patronType: PatronType.Denizen }}
          options={{ uploadable: true }}
        />

        <Divider />
        <Header as="h2">Uploadable ImageBox(New)</Header>
        <ImageBox
          id={this.state.tinyAlbumId}
          vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
          patronKey={{ keyString: 'sampleDenizen', patronType: PatronType.Denizen }}
          options={{ uploadable: true }}
        />
      </Container>
    );
  }
}

export default RegisterIconContainer;
