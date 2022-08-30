import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { CubeType } from 'shared/model';
import { FormTable, Polyglot } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import { CubeModel } from 'cube/cube/model/CubeModel';

interface Props {
  onChangeCubeDescriptionProps: (name: string, value: any) => void;
  onTextareaChange: (name: string, value: any) => void;
  cube: CubeModel;
  readonly?: boolean;
}

interface States {}

@observer
@reactAutobind
class CubeDescriptionView extends ReactComponent<Props, States> {
  render() {
    //
    const { onChangeCubeDescriptionProps, onTextareaChange, cube, readonly } = this.props;

    return (
      <FormTable title="교육 정보">
        <FormTable.Row required name="교육목표">
          <Polyglot.Input
            languageStrings={cube.cubeContents.description.goal}
            name="cubeContents.description.goal"
            onChangeProps={onChangeCubeDescriptionProps}
            placeholder="교육목표를 입력해주세요. (300자까지 입력가능)"
            maxLength="300"
            readOnly={readonly}
          />
        </FormTable.Row>
        <FormTable.Row required name="교육대상">
          <Polyglot.Input
            languageStrings={cube.cubeContents.description.applicants}
            name="cubeContents.description.applicants"
            onChangeProps={onChangeCubeDescriptionProps}
            placeholder="교육대상을 입력해주세요. (300자까지 입력가능)"
            maxLength="300"
            readOnly={readonly}
          />
        </FormTable.Row>
        {/* cube.type === CubeType.Discussion */}
        <FormTable.Row
          required={!readonly && cube.type !== CubeType.Discussion}
          name={cube.type !== CubeType.Discussion ? '교육 내용' : 'Talk 내용'}
        >
          <Polyglot.Editor
            name="cubeContents.description.description"
            languageStrings={cube.cubeContents.description.description}
            onChangeProps={onChangeCubeDescriptionProps}
            placeholder="내용을 입력해주세요. (3,000자까지 입력가능)"
            maxLength={3000}
            readOnly={readonly}
            oneLanguage={Language.Ko}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.Editor
            name="cubeContents.description.description"
            languageStrings={cube.cubeContents.description.description}
            onChangeProps={onChangeCubeDescriptionProps}
            placeholder="내용을 입력해주세요. (3,000자까지 입력가능)"
            maxLength={3000}
            readOnly={readonly}
            oneLanguage={Language.En}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.Editor
            name="cubeContents.description.description"
            languageStrings={cube.cubeContents.description.description}
            onChangeProps={onChangeCubeDescriptionProps}
            placeholder="내용을 입력해주세요. (3,000자까지 입력가능)"
            maxLength={3000}
            readOnly={readonly}
            oneLanguage={Language.Zh}
            disabledTab={true}
          />
        </FormTable.Row>
        <FormTable.Row name="이수조건">
          <Polyglot.TextArea
            name="cubeContents.description.completionTerms"
            languageStrings={cube.cubeContents.description.completionTerms}
            onChangeProps={onTextareaChange}
            placeholder="이수조건을 입력해주세요(1,000자까지 입력가능)"
            maxLength={1000}
            readOnly={readonly}
            oneLanguage={Language.Ko}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.TextArea
            name="cubeContents.description.completionTerms"
            languageStrings={cube.cubeContents.description.completionTerms}
            onChangeProps={onTextareaChange}
            placeholder="이수조건을 입력해주세요(1,000자까지 입력가능)"
            maxLength={1000}
            readOnly={readonly}
            oneLanguage={Language.En}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.TextArea
            name="cubeContents.description.completionTerms"
            languageStrings={cube.cubeContents.description.completionTerms}
            onChangeProps={onTextareaChange}
            placeholder="이수조건을 입력해주세요(1,000자까지 입력가능)"
            maxLength={1000}
            readOnly={readonly}
            oneLanguage={Language.Zh}
            disabledTab={true}
          />
        </FormTable.Row>
        <FormTable.Row name="기타안내">
          <Polyglot.Editor
            name="cubeContents.description.guide"
            languageStrings={cube.cubeContents.description.guide}
            onChangeProps={onChangeCubeDescriptionProps}
            placeholder="기타안내를 입력해주세요. (1,000자까지 입력가능)"
            maxLength={1000}
            readOnly={readonly}
            oneLanguage={Language.Ko}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.Editor
            name="cubeContents.description.guide"
            languageStrings={cube.cubeContents.description.guide}
            onChangeProps={onChangeCubeDescriptionProps}
            placeholder="기타안내를 입력해주세요. (1,000자까지 입력가능)"
            maxLength={1000}
            readOnly={readonly}
            oneLanguage={Language.En}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.Editor
            name="cubeContents.description.guide"
            languageStrings={cube.cubeContents.description.guide}
            onChangeProps={onChangeCubeDescriptionProps}
            placeholder="기타안내를 입력해주세요. (1,000자까지 입력가능)"
            maxLength={1000}
            readOnly={readonly}
            oneLanguage={Language.Zh}
            disabledTab={true}
          />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CubeDescriptionView;
