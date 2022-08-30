import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Input } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { ContentsProviderModel } from '../../../../college/model/ContentsProviderModel';

interface Props {
  defaultValue?: string;
  targetProps?: string;
  onSetCubeIntroPropsByJSON: (name: string, value: string) => void;
  setContentsProvider: () => [];
  onChangeCubeIntroProps: (name: string, value: string) => void;
  getContentsProvider: () => ContentsProviderModel | undefined;
  organizerId: string;
  otherOrganizerName: string;
  readonly?: boolean;
}

@observer
@reactAutobind
class ContentsProviderSelectForCubeIntroView extends React.Component<Props> {
  //
  render() {
    const {
      defaultValue,
      targetProps,
      onSetCubeIntroPropsByJSON,
      setContentsProvider,
      getContentsProvider,
      organizerId,
      otherOrganizerName,
      onChangeCubeIntroProps,
      readonly,
    } = this.props;
    const contentsProviderTsx = setContentsProvider();
    const targetContentProvider = getContentsProvider();
    return (
      <Form.Group>
        {readonly ? (
          <span>{targetContentProvider && getPolyglotToAnyString(targetContentProvider.name)}</span>
        ) : (
          <Form.Select
            disabled={readonly}
            placeholder="Select..."
            width={4}
            options={contentsProviderTsx}
            onChange={(e: any, data: any) => onSetCubeIntroPropsByJSON(`${targetProps}`, data.value)}
            value={defaultValue && defaultValue}
            search
          />
        )}

        {organizerId === 'PVD00018' ? (
          <Form.Field
            disabled={readonly}
            fluid
            control={Input}
            width={13}
            placeholder="선택사항이 없는 경우, 교육기관/출처를 입력해주세요."
            value={otherOrganizerName || ''}
            onChange={(e: any) => onChangeCubeIntroProps('cubeContents.otherOrganizerName', e.target.value)}
          />
        ) : null}
      </Form.Group>
    );
  }
}

export default ContentsProviderSelectForCubeIntroView;
