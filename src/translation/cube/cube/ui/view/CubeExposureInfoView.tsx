import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { FormTable } from 'shared/components';
import { CubeModel } from 'cube/cube';
import Polyglot from 'shared/components/Polyglot';

interface Props {
  cube: CubeModel;
  onChangeCubeProps: (name: string, value: string | [] | {}) => void;
  readonly?: boolean;
}

@observer
@reactAutobind
class CubeExposureInfoView extends ReactComponent<Props, {}> {
  render() {
    const { cube, onChangeCubeProps, readonly } = this.props;

    return (
      <FormTable title="노출 정보">
        <FormTable.Row name="Tag 정보">
          <Polyglot.Input
            languageStrings={cube.cubeContents.tags}
            name="cubeContents.tags"
            onChangeProps={onChangeCubeProps}
            placeholder='Tag 와 Tag는 쉼표(",")로 구분하며, 최대 10개까지 입력하실 수 있습니다.'
            readOnly={readonly}
          />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CubeExposureInfoView;
