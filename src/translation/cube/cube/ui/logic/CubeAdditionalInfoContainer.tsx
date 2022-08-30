import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import CubeService from 'cube/cube/present/logic/CubeService';

interface Props {
  readonly?: boolean;
}

interface State {}

interface Injected {
  cubeService: CubeService;
}

@inject('cubeService')
@observer
@reactAutobind
class CubeAdditionalInfoContainer extends ReactComponent<Props, State, Injected> {
  onChangeCubeProps(name: string, value: string) {
    //
    const { cubeService } = this.injected;
    if (name === 'cubeContents.reportFileBox.reportName') {
      const invalid = value.length > 200;

      if (invalid) {
        return;
      }
    }
    if (name === 'cubeContents.reportFileBox.reportQuestion') {
      const invalid = value.length > 3000;

      if (invalid) {
        return;
      }
    }
    cubeService.changeCubeProps(name, value);
  }

  render() {
    //
    const { cubeService } = this.injected;
    const { cube } = cubeService;
    const { readonly } = this.props;

    return (
      <FormTable title="추가정보">
        <FormTable.Row name="Report 출제">
          <FormTable title="" withoutHeader>
            <FormTable.Row name="Report 명">
              <Polyglot.Input
                languageStrings={cube.cubeContents.reportFileBox.reportName}
                onChangeProps={this.onChangeCubeProps}
                name="cubeContents.reportFileBox.reportName"
                placeholder="Report 명을 입력해주세요. (200자까지 입력가능)"
                maxLength="200"
                readOnly={readonly}
              />
            </FormTable.Row>
            <FormTable.Row name="Write Guide">
              <Polyglot.TextArea
                name="cubeContents.reportFileBox.reportQuestion"
                languageStrings={cube.cubeContents.reportFileBox.reportQuestion}
                onChangeProps={this.onChangeCubeProps}
                placeholder="작성 가이드 및 문제를 입력해주세요. (3,000자까지 입력가능)"
                maxLength={3000}
                readOnly={readonly}
                oneLanguage={Language.Ko}
                disabledTab={true}
              />
              <div className="margin-bottom10" />
              <Polyglot.TextArea
                name="cubeContents.reportFileBox.reportQuestion"
                languageStrings={cube.cubeContents.reportFileBox.reportQuestion}
                onChangeProps={this.onChangeCubeProps}
                placeholder="작성 가이드 및 문제를 입력해주세요. (3,000자까지 입력가능)"
                maxLength={3000}
                readOnly={readonly}
                oneLanguage={Language.En}
                disabledTab={true}
              />
              <div className="margin-bottom10" />
              <Polyglot.TextArea
                name="cubeContents.reportFileBox.reportQuestion"
                languageStrings={cube.cubeContents.reportFileBox.reportQuestion}
                onChangeProps={this.onChangeCubeProps}
                placeholder="작성 가이드 및 문제를 입력해주세요. (3,000자까지 입력가능)"
                maxLength={3000}
                readOnly={readonly}
                oneLanguage={Language.Zh}
                disabledTab={true}
              />
            </FormTable.Row>
          </FormTable>
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CubeAdditionalInfoContainer;
