import React from 'react';
import { Button, Checkbox, Form, RadioProps } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PageModel } from 'shared/model';
import { alert, AlertModel, Modal, RadioGroup } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeService } from '../../../../index';
import { BadgeCategoryService } from '../../../category';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';

interface Props {
  type: string;
  cineroomId: string;
}

interface State {
  categoryId: string;
  subCategoryIds: string[];
}

interface Injected {
  badgeCategoryService: BadgeCategoryService;
  badgeService: BadgeService;
}

@inject('badgeService', 'badgeCategoryService')
@observer
@reactAutobind
class BadgeCreateCategoryModal extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    categoryId: '',
    subCategoryIds: [],
  };

  async onMount() {
    //
    const { badgeService, badgeCategoryService } = this.injected;
    const { badgeMainCategory, badgeSubCategories } = badgeService;
    const { cineroomId } = this.props;

    this.setState({
      categoryId: badgeMainCategory.categoryId,
      subCategoryIds: [...badgeSubCategories.map((subCategory) => subCategory.categoryId)],
    });
    //
    await badgeCategoryService.findAllBadgeCategories(
      BadgeCategoryQueryModel.asBadgeCineroomCategoryRdo(cineroomId, new PageModel(0, 99999999))
    );
  }

  onChange(event: React.FormEvent<HTMLInputElement>, data: RadioProps) {
    //
    this.setState({ categoryId: data.value as string });
  }

  onChangeCheckbox(value: any) {
    //
    const prevCategoryIds = this.state.subCategoryIds;

    if (value === this.state.categoryId) {
      alert(AlertModel.getCustomAlert(false, '선택 오류', 'Main 분야는 Sub 분야로 선택할 수 없습니다.', '확인'));
      return;
    }

    if (prevCategoryIds.includes(value)) {
      //
      const newCategoryIds = [...prevCategoryIds.filter((id) => id !== value)];
      this.setState({ subCategoryIds: newCategoryIds });
    } else {
      const newValue = [...prevCategoryIds, value];
      this.setState({ subCategoryIds: newValue });
    }
  }

  onClickOk(event: React.MouseEvent<HTMLButtonElement>, close: () => void) {
    //
    const { type } = this.props;
    const { categoryId, subCategoryIds } = this.state;
    const { badgeService } = this.injected;

    if (type === 'Main') {
      if (subCategoryIds.includes(categoryId)) {
        //
        badgeService.setSubCategories(subCategoryIds.filter((id) => id !== categoryId));
      }

      badgeService.setMainCategories(categoryId);
    } else {
      badgeService.setSubCategories(subCategoryIds);
    }

    close();
  }

  getCategoryContentValues() {
    //
    const { badgeCategories } = this.injected.badgeCategoryService;
    const ids = badgeCategories.map((badgeCategory) => badgeCategory.id);
    const labels = badgeCategories.map((badgeCategory) => getPolyglotToAnyString(badgeCategory.name));

    return {
      ids,
      labels,
    };
  }

  render() {
    //
    const { badgeService, badgeCategoryService } = this.injected;
    const { type } = this.props;
    const values = this.getCategoryContentValues();
    const { badgeQueryModel } = badgeService;

    return (
      <Modal trigger={<Button>분야 선택</Button>} onMount={this.onMount}>
        <Modal.Header>{type} 분야</Modal.Header>
        <Modal.Content>
          {type === 'Main' ? (
            <Form>
              <Form.Group>
                <RadioGroup
                  values={values.ids}
                  value={this.state.categoryId || badgeQueryModel.categoryId}
                  labels={values.labels}
                  onChange={this.onChange}
                />
              </Form.Group>
            </Form>
          ) : (
            <Form>
              <Form.Group>
                {badgeCategoryService.badgeCategories.map((badgeCategory, index) => (
                  <Form.Field
                    key={badgeCategory.id}
                    control={Checkbox}
                    label={getPolyglotToAnyString(badgeCategory.name)}
                    value={badgeCategory.id}
                    checked={this.state.subCategoryIds.includes(badgeCategory.id)}
                    onChange={(event: any, data: any) => this.onChangeCheckbox(data.value)}
                  />
                ))}
              </Form.Group>
            </Form>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton />
          <Modal.CloseButton primary onClickWithClose={this.onClickOk}>
            선택
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default BadgeCreateCategoryModal;
