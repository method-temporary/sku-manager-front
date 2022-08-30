import React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Image, Segment, Select, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable, RadioGroup, Polyglot } from 'shared/components';
import { SelectType, SelectTypeModel } from 'shared/model';
import { getImagePath, booleanToYesNo, yesNoToBoolean } from 'shared/helper';

import { BadgeModel } from '_data/badge/badges/model';
import { CategoryModel } from '_data/badge/badges/model/vo';

import BadgeCreateCategoryModal from '../logic/BadgeCreateCategoryModal';

const issueAutomaticallyOptions = [
  { key: '1', text: '자동', value: true },
  { key: '2', text: '수동', value: false },
];

const additionalRequirementsNeededOptions = [
  { key: '1', text: 'Yes', value: true },
  { key: '2', text: 'No', value: false },
];

interface Props {
  isUpdatable: boolean;
  badge: BadgeModel;
  onChangeSelectIssueAutomatically: (event: any, data: any) => void;
  changeBadgeQueryProp: (name: string, value: any) => void;
  badgeCategoryMap: Map<string, string>;
  uploadFile: (file: File) => void;
  collegeSelect: SelectTypeModel[];
  collegeMap: Map<string, string>;
  cineroomId: string;
}

@observer
@reactAutobind
class BadgeBasicInfoView extends React.Component<Props> {
  //
  imagePath = getImagePath();
  private fileInputRef = React.createRef<HTMLInputElement>();

  render() {
    //

    const {
      isUpdatable = false,
      badge,
      onChangeSelectIssueAutomatically,
      changeBadgeQueryProp,
      badgeCategoryMap,
      uploadFile,
      cineroomId,
      collegeSelect,
      collegeMap,
    } = this.props;

    const mainCategory = badgeCategoryMap.get(
      new CategoryModel(...badge.categories.filter((category) => category.mainCategory)).categoryId
    );
    const subCategories = badge.categories
      .filter((subCategory) => !subCategory.mainCategory)
      .map((category) => badgeCategoryMap.get(category.categoryId));

    return (
      <FormTable title="기본 정보">
        <FormTable.Row name="지원 언어">
          <Polyglot.Languages onChangeProps={changeBadgeQueryProp} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="기본 언어">
          <Polyglot.Default onChangeProps={changeBadgeQueryProp} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="Badge 명" required>
          <Polyglot.Input
            name="name"
            onChangeProps={changeBadgeQueryProp}
            languageStrings={badge.name}
            maxLength="35"
            readOnly={!isUpdatable}
            placeholder="등록하실 Badge의 명칭을 입력해주세요. (35자까지 입력가능)"
          />
        </FormTable.Row>
        <FormTable.Row name="HR 선발형" required>
          {isUpdatable ? (
            <Form.Field
              control={Select}
              width={4}
              placeholder="Select"
              options={SelectType.badgeSelected}
              value={badge.forSelectedMember}
              onChange={(_: any, data: any) => changeBadgeQueryProp('forSelectedMember', data.value)}
            />
          ) : badge.forSelectedMember ? (
            'Yes'
          ) : (
            'No'
          )}
        </FormTable.Row>
        <FormTable.Row name="유형" required>
          {isUpdatable ? (
            <Form.Field
              control={Select}
              width={4}
              placeholder="Select"
              options={SelectType.badgeType}
              value={badge.type}
              onChange={(_: any, data: any) => changeBadgeQueryProp('type', data.value)}
            />
          ) : (
            badge.type
          )}
        </FormTable.Row>
        <FormTable.Row name="설계 주체" required>
          {isUpdatable ? (
            <Form.Field
              control={Select}
              width={4}
              placeholder="Select"
              options={collegeSelect}
              value={badge.collegeId}
              onChange={(event: any, data: any) => changeBadgeQueryProp('collegeId', data.value)}
              disabled={collegeSelect.length === 1}
            />
          ) : (
            collegeMap.get(badge.collegeId)
          )}
        </FormTable.Row>
        <FormTable.Row name="분야" required>
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  Main 분야 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell>
                  {isUpdatable && <BadgeCreateCategoryModal type="Main" cineroomId={cineroomId} />}
                  <span>{mainCategory}</span>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Sub 분야</Table.Cell>
                <Table.Cell>
                  {isUpdatable && <BadgeCreateCategoryModal type="Sub" cineroomId={cineroomId} />}
                  <span>
                    {subCategories &&
                      subCategories.map((subcategory, index) => (index === 0 ? subcategory : `, ${subcategory}`))}
                  </span>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </FormTable.Row>
        <FormTable.Row name="레벨" required>
          {isUpdatable ? (
            <Form.Field
              control={Select}
              width={4}
              placeholder="Select"
              options={SelectType.badgeDifficulty}
              value={badge.level}
              onChange={(event: any, data: any) => changeBadgeQueryProp('level', data.value)}
            />
          ) : (
            badge.level
          )}
        </FormTable.Row>
        <FormTable.Row name="발급구분" required>
          {isUpdatable ? (
            <Form.Field
              control={Select}
              width={4}
              placeholder="Select"
              options={issueAutomaticallyOptions}
              value={badge.issueAutomatically}
              onChange={(_: any, data: any) => onChangeSelectIssueAutomatically('issueAutomatically', data.value)}
            />
          ) : badge.issueAutomatically ? (
            '자동'
          ) : (
            '수동'
          )}
        </FormTable.Row>
        <FormTable.Row name="추가발급조건" required>
          {isUpdatable ? (
            <Form.Field
              disabled={badge.issueAutomatically}
              control={Select}
              width={4}
              placeholder="Select"
              options={additionalRequirementsNeededOptions}
              value={badge.additionalRequirementsNeeded}
              onChange={(_: any, data: any) => changeBadgeQueryProp('additionalRequirementsNeeded', data.value)}
            />
          ) : badge.additionalRequirementsNeeded ? (
            'Yes'
          ) : (
            'No'
          )}
        </FormTable.Row>
        <FormTable.Row name="아이콘" required>
          {isUpdatable && (
            <>
              <Button
                className="file-select-btn"
                content={badge.fileName || '파일 선택'}
                labelPosition="left"
                icon="file"
                onClick={() => {
                  if (this.fileInputRef && this.fileInputRef.current) {
                    this.fileInputRef.current.click();
                  }
                }}
              />
              <input
                id="file"
                type="file"
                ref={this.fileInputRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0])}
                hidden
              />
            </>
          )}
          {badge && badge.iconUrl ? (
            <Segment.Inline>
              <Image src={this.imagePath + badge.iconUrl} size="small" verticalAlign="bottom" />
            </Segment.Inline>
          ) : null}
          <p className="info-text-gray">- JPG, GIF, PNG, SVG 파일을 등록하실 수 있습니다.</p>
          <p className="info-text-gray">- Icon의 경우 50x50 크기의 파일을 등록해주세요.</p>
        </FormTable.Row>
        <FormTable.Row name="공개 / 비공개">
          {isUpdatable ? (
            <Form.Group>
              <RadioGroup
                value={booleanToYesNo(badge.searchable)}
                values={['Yes', 'No']}
                labels={['공개', '비공개']}
                onChange={(e: any, data: any) => changeBadgeQueryProp('searchable', yesNoToBoolean(data.value))}
              />
            </Form.Group>
          ) : badge.searchable ? (
            '공개'
          ) : (
            '비공개'
          )}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default BadgeBasicInfoView;
