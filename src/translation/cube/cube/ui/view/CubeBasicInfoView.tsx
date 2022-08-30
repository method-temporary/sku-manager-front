import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { CubeType } from 'shared/model';
import { FormTable, Polyglot } from 'shared/components';

import { CubeModel } from 'cube/cube/model/CubeModel';

interface Props {
  onChangeCubeProps: (name: string, value: any) => void;
  cube: CubeModel;
  readonly?: boolean;
}

interface States {}

@observer
@reactAutobind
class CubeBasicInfoView extends ReactComponent<Props, States> {
  render() {
    const { onChangeCubeProps, cube, readonly } = this.props;

    const discussionTitle = cube.type !== CubeType.Discussion ? 'Cube명' : 'Talk 제목';

    return (
      <FormTable title="기본 정보">
        <FormTable.Row required name="지원 언어">
          <Polyglot.Languages onChangeProps={onChangeCubeProps} readOnly={readonly} />
        </FormTable.Row>
        <FormTable.Row required name="기본 언어">
          <Polyglot.Default onChangeProps={onChangeCubeProps} readOnly={readonly} />
        </FormTable.Row>
        <FormTable.Row required name={discussionTitle}>
          {cube && cube.type === CubeType.Cohort ? (
            <Polyglot.Input
              languageStrings={cube.name}
              name="name"
              onChangeProps={onChangeCubeProps}
              readOnly={readonly}
              placeholder="과정명을 입력해주세요. (200자까지 입력가능)"
              maxLength="200"
            />
          ) : (
            <Polyglot.Input
              languageStrings={cube.name}
              name="name"
              onChangeProps={onChangeCubeProps}
              placeholder={discussionTitle + '을 입력해주세요. (200자까지 입력가능)'}
              maxLength="200"
              readOnly={readonly}
            />
          )}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CubeBasicInfoView;
