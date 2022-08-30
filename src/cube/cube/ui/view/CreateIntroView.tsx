import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, Input } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { CubeType } from 'shared/model';
import { FormTable, Polyglot } from 'shared/components';

import { CubeModel } from '../../model/CubeModel';
import CreateInstructorInfoView from './CreateInstructorInfoView';
import CubeTypeDetailContainer from '../logic/CubeTypeDetailContainer';
import CubeInstructorModel from '../../CubeInstructorModel';

interface Props {
  changeCubeProps: (name: string, value: any) => void;
  onChangeTargetInstructor: (index: number, name: string, value: any) => void;
  onSelectInstructor: (index: number, name: string, value: boolean) => void;
  onDeleteInstructor: (index: number) => void;
  setHourAndMinute: (name: string, value: number) => void;
  getContentsProvider: (id: string) => string;

  cube: CubeModel;
  filesMap: Map<string, any>;
  cubeInstructors: CubeInstructorModel[];
  readonly?: boolean;
}

@observer
@reactAutobind
class CreateIntroView extends ReactComponent<Props, {}> {
  //

  //교육내용 ReactQuill 객체
  eduDescriptionQuillRef: any = null;

  render() {
    //
    const {
      changeCubeProps,
      onChangeTargetInstructor,
      onSelectInstructor,
      onDeleteInstructor,
      setHourAndMinute,
      getContentsProvider,
    } = this.props;
    const { cube, filesMap, cubeInstructors, readonly } = this.props;

    const goalLength = (cube.cubeContents.description.goal && cube.cubeContents.description.goal.length) || 0;
    const applicantsLength =
      (cube.cubeContents.description.applicants && cube.cubeContents.description.applicants.length) || 0;

    return (
      <Polyglot languages={cube.langSupports}>
        <FormTable title="교육정보 및 부가정보">
          <FormTable.Row name="교육목표">
            <Polyglot.TextArea
              name="cubeContents.description.goal"
              languageStrings={cube.cubeContents.description.goal}
              onChangeProps={changeCubeProps}
              readOnly={readonly}
              placeholder="교육목표를 입력해주세요. (100자까지 입력가능)"
            />
            {/*{readonly ? (*/}
            {/*  <span>{cube.cubeContents.description.goal}</span>*/}
            {/*) : (*/}
            {/*  <div className={goalLength >= 100 ? 'ui right-top-count input error' : 'ui right-top-count input'}>*/}
            {/*    <span className="count">*/}
            {/*      <span className="now">{goalLength}</span>/<span className="max">100</span>*/}
            {/*    </span>*/}
            {/*    <TextArea*/}
            {/*      rows={3}*/}
            {/*      id="goal"*/}
            {/*      placeholder="Please enter the 교육목표. (Up to 100 characters)"*/}
            {/*      value={getPolyglotToString(cube.cubeContents.description.goal) || ''}*/}
            {/*      onChange={(e: any) => changeCubeProps('cubeContents.description.goal', e.target.value)}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*)}*/}
          </FormTable.Row>
          <FormTable.Row required={!readonly} name="교육대상">
            <Polyglot.TextArea
              name="cubeContents.description.applicants"
              languageStrings={cube.cubeContents.description.applicants}
              onChangeProps={changeCubeProps}
              readOnly={readonly}
              placeholder="교육대상을 입력해주세요. (100자까지 입력가능)"
            />
            {/*{readonly ? (*/}
            {/*  <span>{cube.cubeContents.description.applicants}</span>*/}
            {/*) : (*/}
            {/*  <div className={applicantsLength >= 100 ? 'ui right-top-count input error' : 'ui right-top-count input'}>*/}
            {/*    <span className="count">*/}
            {/*      <span className="now">{applicantsLength}</span>/<span className="max">100</span>*/}
            {/*    </span>*/}
            {/*    <TextArea*/}
            {/*      rows={3}*/}
            {/*      id="applicants"*/}
            {/*      placeholder="Please type the 교육대상. (Up to 100 characters)"*/}
            {/*      value={getPolyglotToString(cube.cubeContents.description.applicants) || ''}*/}
            {/*      onChange={(e: any) => changeCubeProps('cubeContents.description.applicants', e.target.value)}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*)}*/}
          </FormTable.Row>
          <FormTable.Row required={!readonly} name="교육내용">
            <Polyglot.Editor
              name="cubeContents.description.description"
              onChangeProps={changeCubeProps}
              languageStrings={cube.cubeContents.description.description}
              maxLength={1000}
              readOnly={readonly}
            />
          </FormTable.Row>
          <FormTable.Row required={!readonly} name="교육시간">
            {readonly ? (
              <span>{`${cube.learningTime}분`}</span>
            ) : (
              <Form.Group style={{ display: 'flex', position: 'relative' }}>
                <Form.Field
                  control={Input}
                  placeholder="Select"
                  width={3}
                  type="number"
                  value={parseInt(String(cube.learningTime / 60), 10)}
                  onChange={(e: any, data: any) => setHourAndMinute('hour', data.value)}
                />
                <Form.Field style={{ lineHeight: '2.5', paddingLeft: '.5em', paddingRight: '.5em' }}>시간</Form.Field>
                <Form.Field
                  control={Input}
                  placeholder="Select"
                  width={3}
                  type="number"
                  value={parseInt(String(cube.learningTime % 60), 10)}
                  onChange={(e: any, data: any) => setHourAndMinute('minute', data.value)}
                />
                <Form.Field style={{ lineHeight: '2.5', paddingLeft: '.5em', paddingRight: '.5em' }}>분</Form.Field>
              </Form.Group>
            )}
          </FormTable.Row>
          <FormTable.Row name="교육기관/출처">{getContentsProvider(cube.cubeContents.organizerId)}</FormTable.Row>
          {cube.type === CubeType.ClassRoomLecture || cube.type === CubeType.ELearning ? null : (
            <FormTable.Row name="강사">
              <CreateInstructorInfoView
                onChangeTargetInstructor={onChangeTargetInstructor}
                onSelectInstructor={onSelectInstructor}
                onDeleteInstructor={onDeleteInstructor}
                cube={cube}
                cubeInstructors={cubeInstructors}
                readonly={readonly}
                round={1}
              />
            </FormTable.Row>
          )}

          <CubeTypeDetailContainer filesMap={filesMap} cubeType={cube.type} readonly={readonly} />
        </FormTable>
      </Polyglot>
    );
  }
}

export default CreateIntroView;
