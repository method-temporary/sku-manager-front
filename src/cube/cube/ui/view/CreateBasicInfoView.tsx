import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CubeService } from '../../index';
import { CollegeService } from '../../../../college';
import SearchTag from '../../../board/searchTag/model/SearchTag';
import { CubeModel } from '../../model/CubeModel';
import FirstCategoryModal from '../logic/FirstCategoryModal';
import SecondCategoryModal from '../logic/SecondCategoryModal';
import { getMainCollegeAndChannelText, getSubCollegeAndChannelText } from '../logic/CubeHelper';
import UserWorkspaceModel from '../../../../userworkspace/model/UserWorkspaceModel';

interface Props {
  onChangeCubeProps: (name: string, value: string | {} | []) => void;
  onChangeTagPropsWithAutoComplete: (name: string, value: any) => void;
  addCubeTagsProps: (value: string) => void;
  removeCubeTagsProps: (index: number) => void;
  cube: CubeModel;
  userWorkspaces: UserWorkspaceModel[];
  searchTags?: SearchTag[];
  readonly?: boolean;

  addAllSharedCineroomId: (checked: boolean) => void;
  addSharedCineroomId: (cineroomId: string) => void;

  cubeService: CubeService;
  collegeService: CollegeService;
}

@observer
@reactAutobind
class CreateBasicInfoView extends ReactComponent<Props> {
  //
  componentDidMount(): void {}

  getSubsidiaryName(id: string): string {
    //
    let targetName = '';
    if (this.props.userWorkspaces.some((target) => target.id === id)) {
      targetName = getPolyglotToAnyString(this.props.userWorkspaces.find((target) => target.id === id)!.name);
    }
    return targetName;
  }

  findCollegeName(collegeId: string): string | undefined {
    //
    const { collegeService } = this.props;
    return collegeService.collegesMap.get(collegeId);
  }

  findChannelName(channelId: string): string | undefined {
    //
    const { collegeService } = this.props;
    return collegeService.channelMap.get(channelId);
  }

  renderSubCategoryText(): JSX.Element {
    //
    const { collegeService, cubeService } = this.props;
    const subCategories = cubeService.cube.categories.filter((category) => !category.mainCategory);
    const { collegesMap, channelMap } = collegeService;

    const subColleges: string[] = [];
    const subCollegesTexts: string[] = [];

    subCategories.forEach((category) => {
      subColleges.indexOf(category.collegeId) === -1 && subColleges.push(category.collegeId);
    });

    subColleges.forEach((collegeId) => {
      let text = '';
      subCategories
        .filter((category) => category.collegeId === collegeId)
        .forEach((category, cIndex) => {
          cIndex === 0
            ? (text = `${collegesMap.get(category.collegeId)} > ${channelMap.get(category.channelId)}`)
            : (text += `, ${channelMap.get(category.channelId)}`);
        });

      subCollegesTexts.push(text);
    });

    return (
      <>
        {subCollegesTexts.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </>
    );
  }

  render() {
    //
    const {
      onChangeCubeProps,
      addCubeTagsProps,
      onChangeTagPropsWithAutoComplete,
      removeCubeTagsProps,
      cube,
      searchTags,
      readonly,
      cubeService,
      collegeService,
    } = this.props;

    //과정명 글자수(100자 이내)
    const nameCount = cube.name.length || 0;
    const isSelectedCollegeAndChannel =
      cube && cube.getMainCategory() && cube.getMainCategory().collegeId && cube.getMainCategory().channelId;

    return (
      <FormTable title="기본정보 및 노출정보">
        <FormTable.Row name="강좌명" required={!readonly}>
          <Polyglot.Input
            languageStrings={cube.name}
            name="name"
            onChangeProps={onChangeCubeProps}
            readOnly={readonly}
            placeholder="과정명을 입력해주세요. (100자까지 입력가능)"
          />
          {/*{readonly ? (*/}
          {/*  <p>{cube.name}</p>*/}
          {/*) : (*/}
          {/*  <div className={nameCount >= 100 ? 'ui right-top-count input error' : 'ui right-top-count input'}>*/}
          {/*    <span className="count">*/}
          {/*      <span className="now">{nameCount}</span>/<span className="max">100</span>*/}
          {/*    </span>*/}
          {/*    <input*/}
          {/*      id="name"*/}
          {/*      type="text"*/}
          {/*      placeholder="Please enter the 과정명. (Up to 100 characters)"*/}
          {/*      value={getPolyglotToString(cube.name) || ''}*/}
          {/*      onChange={(e: any) => onChangeCubeProps('name', e.target.value)}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}
        </FormTable.Row>
        {/*<FormTable.Row name="공개 범위">*/}
        {/*  {readonly ? (*/}
        {/*    cube.sharingCineroomIds.length &&*/}
        {/*    cube.sharingCineroomIds.map((id, index) => {*/}
        {/*      return (*/}
        {/*        <span key={id}>{index !== 0 ? `, ${this.getSubsidiaryName(id)}` : this.getSubsidiaryName(id)}</span>*/}
        {/*      );*/}
        {/*    })*/}
        {/*  ) : (*/}
        {/*    <div className="check-group">*/}
        {/*      <div className="table-inner">*/}
        {/*        {userWorkspaces && userWorkspaces.length > 1 && (*/}
        {/*          <Grid.Column>*/}
        {/*            <Form.Field*/}
        {/*              control={Checkbox}*/}
        {/*              label="All"*/}
        {/*              checked={checked}*/}
        {/*              onChange={(e: any, data: any) => addAllSharedCineroomId(data.checked)}*/}
        {/*            />*/}
        {/*          </Grid.Column>*/}
        {/*        )}*/}
        {/*        {userWorkspaces &&*/}
        {/*          userWorkspaces.length &&*/}
        {/*          userWorkspaces.map((cineroom, index) => (*/}
        {/*            <Grid.Column key={index}>*/}
        {/*              <Form.Field*/}
        {/*                key={index}*/}
        {/*                control={Checkbox}*/}
        {/*                label={(cineroom && cineroom.name) || ''}*/}
        {/*                value={cineroom && cineroom.id}*/}
        {/*                checked={cube.sharingCineroomIds.includes(cineroom.id)}*/}
        {/*                onChange={() => addSharedCineroomId(cineroom.id)}*/}
        {/*              />*/}
        {/*            </Grid.Column>*/}
        {/*          ))}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</FormTable.Row>*/}
        <FormTable.Row required={!readonly} name="메인 채널">
          <>
            {!readonly && <FirstCategoryModal disabled={readonly} />}
            {(isSelectedCollegeAndChannel &&
              // <span>
              //   {this.findCollegeName(cube.getMainCategory().collegeId)} &gt;
              //   {this.findChannelName(cube.getMainCategory().channelId)}
              // </span>
              getMainCollegeAndChannelText(cubeService, collegeService)) ||
              ''}
          </>
        </FormTable.Row>
        <FormTable.Row name="서브 채널">
          {!readonly && <SecondCategoryModal disabled={readonly} />}
          {/*{this.renderSubCategoryText()}*/}
          {getSubCollegeAndChannelText(cubeService, collegeService)}
        </FormTable.Row>
        <FormTable.Row name="교육형태">{cube.type}</FormTable.Row>
        <FormTable.Row name="Tag 정보">
          {/*TODO: Create관리 Tag정보 view*/}
          {/*{readonly ? (*/}
          {/*  cube.cubeContents.tags.map((tag, index) => <span key={index}>{index !== 0 ? `, ${tag}` : tag}</span>)*/}
          {/*) : (*/}
          {/*  <>*/}
          {/*    <div className="btn-group">*/}
          {/*      {cube.cubeContents.tags &&*/}
          {/*        cube.cubeContents.tags &&*/}
          {/*        cube.cubeContents.tags.map((result, index) => (*/}
          {/*          <Button key={index} size="mini" basic onClick={() => removeCubeTagsProps(index)}>*/}
          {/*            {result} <Icon name="delete" />*/}
          {/*          </Button>*/}
          {/*        ))}*/}
          {/*    </div>*/}
          {/*    <Form.Field*/}
          {/*      control={Input}*/}
          {/*      value={cube.cubeContents.tag || ''}*/}
          {/*      onChange={(e: any) => onChangeTagPropsWithAutoComplete('cubeContents.tag', e.target.value)}*/}
          {/*      style={{ width: '100%', marginBottom: '0px' }}*/}
          {/*    />*/}
          {/*    {searchTags && searchTags.length > 0 && (*/}
          {/*      <div style={{ maxHeight: '200px', overflow: 'auto' }}>*/}
          {/*        <Table celled selectable>*/}
          {/*          <Table.Body>*/}
          {/*            {searchTags.map((element) => (*/}
          {/*              <Table.Row onClick={() => addCubeTagsProps(element.tag)}>*/}
          {/*                <Table.Cell>{element.tag}</Table.Cell>*/}
          {/*              </Table.Row>*/}
          {/*            ))}*/}
          {/*          </Table.Body>*/}
          {/*        </Table>*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  </>*/}
          {/*)}*/}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CreateBasicInfoView;
