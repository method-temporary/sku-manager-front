import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Grid, Image, Table, Radio } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { FormTable } from 'shared/components';
import Polyglot from 'shared/components/Polyglot';
import { getImagePath } from 'shared/helper';

import { BadgeCategoryModel } from '../../../../../_data/badge/badgeCategories/model/BadgeCategoryModel';
import { BadgeCategoryThemeColor } from '../../model/BadgeCategoryThemeColor';

interface Props {
  changeBadgeCategoryProps: (name: string, value: any) => void;
  uploadFile: (file: File, name: 'iconPath' | 'topImagePath' | 'backgroundImagePath') => void;
  topIconFileName: string;
  badgeCategory: BadgeCategoryModel;
  fileName: string;
  backGroundName: string;
  isUpdatable: boolean;
}

@observer
@reactAutobind
class DetailBadgeCategoryManagementView extends ReactComponent<Props> {
  //
  imagePath = getImagePath();

  private fileInputRef = React.createRef<HTMLInputElement>();
  private fileInputBackRef = React.createRef<HTMLInputElement>();
  private fileInputTopRef = React.createRef<HTMLInputElement>();

  render() {
    //
    const {
      changeBadgeCategoryProps,
      uploadFile,
      badgeCategory,
      fileName,
      isUpdatable,
      backGroundName,
      topIconFileName,
    } = this.props;

    return (
      <FormTable title="기본 정보">
        <FormTable.Row name="지원 언어">
          <Polyglot.Languages onChangeProps={changeBadgeCategoryProps} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="기본 언어">
          <Polyglot.Default onChangeProps={changeBadgeCategoryProps} readOnly={!isUpdatable} />
        </FormTable.Row>

        <FormTable.Row name="Badge 분야명" required>
          {/*{(isUpdatable && (*/}
          {/*  <Form.Field*/}
          {/*    control={Input}*/}
          {/*    width={16}*/}
          {/*    placeholder="Badge 분야명을 입력해주세요."*/}
          {/*    value={(badgeCategory && getPolyglotToString(badgeCategory.name)) || ''}*/}
          {/*    onChange={(e: any) => changeBadgeCategoryProps('name', e.target.value)}*/}
          {/*  />*/}
          {/*)) || <p>{getPolyglotToString(badgeCategory.name)}</p>}*/}

          <Polyglot.Input
            name="name"
            onChangeProps={changeBadgeCategoryProps}
            languageStrings={badgeCategory.name}
            readOnly={!isUpdatable}
            placeholder="Badge 분야명을 입력해주세요."
          />
        </FormTable.Row>
        <FormTable.Row name="Badge 분야 대표 Image" required>
          <Grid>
            <Grid.Row>
              <Grid.Column width={11}>
                <Image src={`${process.env.PUBLIC_URL}/images/badgeIconSample.png`} className="ui image" />
              </Grid.Column>
              <Grid.Column width={13}>
                <Button
                  className="file-select-btn"
                  content={fileName || '파일 선택'}
                  labelPosition="left"
                  icon="file"
                  disabled={!isUpdatable}
                  onClick={() => {
                    if (this.fileInputRef && this.fileInputRef.current) {
                      this.fileInputRef.current.click();
                    }
                  }}
                />
                <input
                  id="icon"
                  type="file"
                  ref={this.fileInputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.files && uploadFile(e.target.files[0], 'iconPath');
                  }}
                  hidden
                />
                {badgeCategory && badgeCategory.iconPath ? (
                  <Image src={badgeCategory.iconPath && this.imagePath + badgeCategory.iconPath} />
                ) : null}
                <p className="info-text-gray">- JPG, GIF, SVG 파일을 등록하실 수 있습니다.</p>
                <p className="info-text-gray">- 아이콘 이미지의 경우 54x54 크기의 파일을 등록해주세요.</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </FormTable.Row>
        <FormTable.Row name="Theme Color" required>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                <Image src="https://image.mysuni.sk.com/suni-asset/public/badge_star.png" />
              </Grid.Column>
              <Grid.Column width={13}>
                {(isUpdatable && (
                  <>
                    <Table celled>
                      <colgroup>
                        <col width="20%" />
                        <col width="80%" />
                      </colgroup>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>mySUNI</Table.Cell>
                          <Table.Cell>
                            <Form.Group>
                              <Form.Field
                                control={Radio}
                                label="Blue"
                                value={BadgeCategoryThemeColor.Blue}
                                checked={badgeCategory && badgeCategory.themeColor === BadgeCategoryThemeColor.Blue}
                                onChange={(e: any, data: any) => changeBadgeCategoryProps('themeColor', data.value)}
                              />
                              <Form.Field
                                control={Radio}
                                label="Yellow"
                                value={BadgeCategoryThemeColor.Yellow}
                                checked={badgeCategory && badgeCategory.themeColor === BadgeCategoryThemeColor.Yellow}
                                onChange={(e: any, data: any) => changeBadgeCategoryProps('themeColor', data.value)}
                              />
                              <Form.Field
                                control={Radio}
                                label="Green"
                                value={BadgeCategoryThemeColor.Green}
                                checked={badgeCategory && badgeCategory.themeColor === BadgeCategoryThemeColor.Green}
                                onChange={(e: any, data: any) => changeBadgeCategoryProps('themeColor', data.value)}
                              />
                              <Form.Field
                                control={Radio}
                                label="Red"
                                value={BadgeCategoryThemeColor.Red}
                                checked={badgeCategory && badgeCategory.themeColor === BadgeCategoryThemeColor.Red}
                                onChange={(e: any, data: any) => changeBadgeCategoryProps('themeColor', data.value)}
                              />
                              <Form.Field
                                control={Radio}
                                label="SkyBlue"
                                value={BadgeCategoryThemeColor.SkyBlue}
                                checked={badgeCategory && badgeCategory.themeColor === BadgeCategoryThemeColor.SkyBlue}
                                onChange={(e: any, data: any) => changeBadgeCategoryProps('themeColor', data.value)}
                              />
                            </Form.Group>
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>멤버사</Table.Cell>
                          <Table.Cell>
                            <Form.Group>
                              <Form.Field
                                control={Radio}
                                label="Orange"
                                value={BadgeCategoryThemeColor.Orange}
                                checked={badgeCategory && badgeCategory.themeColor === BadgeCategoryThemeColor.Orange}
                                onChange={(e: any, data: any) => changeBadgeCategoryProps('themeColor', data.value)}
                              />
                              <Form.Field
                                control={Radio}
                                label="LightGreen"
                                value={BadgeCategoryThemeColor.LightGreen}
                                checked={
                                  badgeCategory && badgeCategory.themeColor === BadgeCategoryThemeColor.LightGreen
                                }
                                onChange={(e: any, data: any) => changeBadgeCategoryProps('themeColor', data.value)}
                              />
                              <Form.Field
                                control={Radio}
                                label="Purple"
                                value={BadgeCategoryThemeColor.Purple}
                                checked={badgeCategory && badgeCategory.themeColor === BadgeCategoryThemeColor.Purple}
                                onChange={(e: any, data: any) => changeBadgeCategoryProps('themeColor', data.value)}
                              />
                            </Form.Group>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </>
                )) || (
                  <>
                    <div
                      style={{
                        float: 'left',
                        width: '18px',
                        height: '18px',
                        marginRight: '5px',
                        backgroundColor: `${badgeCategory.themeColor}`,
                      }}
                    />
                    <p>
                      {badgeCategory.themeColor === '#34508c' && 'Blue'}
                      {badgeCategory.themeColor === '#ffb136' && 'Yellow'}
                      {badgeCategory.themeColor === '#428052' && 'Green'}
                      {badgeCategory.themeColor === '#ea012c' && 'Red'}
                      {badgeCategory.themeColor === '#61c1be' && 'SkyBlue'}
                      {badgeCategory.themeColor === '#ef6d47' && 'Orange'}
                      {badgeCategory.themeColor === '#7db820' && 'LightGreen'}
                      {badgeCategory.themeColor === '#9947df' && 'Purple'}
                    </p>
                  </>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </FormTable.Row>

        <FormTable.Row name="Badge 상단 Image" required>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                <Image src="https://image.mysuni.sk.com/suni-asset/public/badge_logo.png" />
              </Grid.Column>
              <Grid.Column width={13}>
                <Button
                  className="file-select-btn"
                  content={topIconFileName || '파일 선택'}
                  labelPosition="left"
                  icon="file"
                  disabled={!isUpdatable}
                  onClick={() => {
                    if (this.fileInputTopRef && this.fileInputTopRef.current) {
                      this.fileInputTopRef.current.click();
                    }
                  }}
                />
                <input
                  id="topImage"
                  type="file"
                  ref={this.fileInputTopRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.files && uploadFile(e.target.files[0], 'topImagePath');
                  }}
                  hidden
                />
                {badgeCategory && badgeCategory.topImagePath ? (
                  <Image src={badgeCategory.topImagePath && this.imagePath + badgeCategory.topImagePath} />
                ) : null}
                <p className="info-text-gray">- JPG, GIF, SVG 파일을 등록하실 수 있습니다.</p>
                <p className="info-text-gray">- Badge 상단 Image 의 경우 58x24 크기의 파일을 등록해주세요.</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </FormTable.Row>

        <FormTable.Row name="Badge 배경 Image" required>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                <Image src="https://image.mysuni.sk.com/suni-asset/public/badge_bg.png" />
              </Grid.Column>
              <Grid.Column width={13}>
                <Button
                  className="file-select-btn"
                  content={backGroundName || '파일 선택'}
                  labelPosition="left"
                  icon="file"
                  disabled={!isUpdatable}
                  onClick={() => {
                    if (this.fileInputBackRef && this.fileInputBackRef.current) {
                      this.fileInputBackRef.current.click();
                    }
                  }}
                />
                <input
                  id="backGroundImage"
                  type="file"
                  ref={this.fileInputBackRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    e.target.files && uploadFile(e.target.files[0], 'backgroundImagePath')
                  }
                  hidden
                />
                {badgeCategory && badgeCategory.backgroundImagePath ? (
                  <Image
                    src={badgeCategory.backgroundImagePath && this.imagePath + badgeCategory.backgroundImagePath}
                  />
                ) : null}
                <p className="info-text-gray">- JPG, GIF, SVG 파일을 등록하실 수 있습니다.</p>
                <p className="info-text-gray">- Badge 배경 Image의 경우 232x232 크기의 파일을 등록해주세요.</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default DetailBadgeCategoryManagementView;
