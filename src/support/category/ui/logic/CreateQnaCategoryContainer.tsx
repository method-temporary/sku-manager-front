import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Grid, List, Segment, Tab, Table } from 'semantic-ui-react';

import { alert, AlertModel, confirm, ConfirmModel, PageTitle, Polyglot } from 'shared/components';
import { ALL_LANGUAGES } from 'shared/components/Polyglot';
import { SelectType } from 'shared/model';

import { CategoryService } from '../../index';
import CreateCategoryListView from '../view/CreateCategoryListView';
import { SupportType } from '../../model/vo/SupportType';
import CategoryModel from '../../model/CategoryModel';

interface Param {
  cineroomId: string;
}

interface Props extends RouteComponentProps<Param> {
  supportType: SupportType;
}

interface Injected {
  categoryService: CategoryService;
}

// @inject('categoryService')
@inject('categoryService')
@observer
@reactAutobind
class CreateQnaCategoryContainer extends ReactComponent<Props, {}, Injected> {
  //
  componentDidMount() {
    //
    this.init();
  }

  componentDidUpdate(prevProps: any) {
    //
    if (this.props.supportType !== prevProps.supportType) {
      this.init();
    }
  }

  async init() {
    const { categoryService } = this.injected;
    const { supportType } = this.props;
    await categoryService.findAll(supportType);
  }

  changeName(name: string, value: any, config?: { index: number; parentIndex?: number }) {
    //
    const { changeCategoriesProps, changeCategoriesSubCategoriesProps } = this.injected.categoryService;

    if (config) {
      const index = config.index;
      const parentIndex = config.parentIndex;

      if (parentIndex != undefined) {
        //
        changeCategoriesSubCategoriesProps(index, name, value, parentIndex);
      } else {
        //
        changeCategoriesProps(index, name, value);
      }
    }
  }

  onClickAddCategory(index?: number, categoryId?: string) {
    //
    const { addCategories, addSubCategories, getNewDisplayOrder } = this.injected.categoryService;

    const newCategory = new CategoryModel();
    newCategory.isModify = true;
    newCategory.supportType = this.props.supportType;
    newCategory.displayOrder = getNewDisplayOrder(index);

    if (index === undefined) {
      addCategories(newCategory);
    } else {
      newCategory.parentId = categoryId || null;
      addSubCategories(index, newCategory);
    }
  }

  onClickModifyFrom(index: number, id: string, isModify: boolean, parentIndex?: number) {
    //
    const { changeCategoriesProps, changeCategoriesSubCategoriesProps, removeCategories, removeSubCategories } =
      this.injected.categoryService;

    // parentIndex
    // O -> Sub Category
    // undefined -> Main Category
    if (parentIndex === undefined) {
      // Id ??? ?????? ????????? ?????? ?????? ????????? ??????
      // -> ?????? -> isModify ??? ??????
      // -> ?????? ?????? -> ???????????? ??????
      if (id) {
        changeCategoriesProps(index, 'isModify', isModify);
      } else {
        removeCategories(index);
      }
    } else {
      // Id ??? ?????? ????????? ?????? ?????? ????????? ??????
      // -> ?????? -> isModify ??? ??????
      // -> ?????? ?????? -> ???????????? ??????
      if (id) {
        changeCategoriesSubCategoriesProps(index, 'isModify', isModify, parentIndex);
      } else {
        removeSubCategories(index, parentIndex);
      }
    }
  }

  onClickCategoryOrder(seq: number, newSeq: number, parentIndex?: number) {
    //
    const { categories, modifyCategory, changeCategoriesOrder, changeCategoriesSubCategoryOrder } =
      this.injected.categoryService;

    // selectedCategory -> ?????? ?????? ????????? ?????? Category
    // chosenCategory -> ?????? ???????????? ?????? ????????? Category
    let selectedCategory: CategoryModel;
    let chosenCategory: CategoryModel;

    // parentIndex
    // O -> Sub Category
    // undefined -> Main Category
    if (parentIndex === undefined) {
      selectedCategory = categories[seq];
      chosenCategory = categories[newSeq];
    } else {
      const subCategories = categories[parentIndex].subCategories;

      selectedCategory = subCategories[seq];
      chosenCategory = subCategories[newSeq];
    }

    modifyCategory(selectedCategory.id, {
      nameValues: [{ name: 'displayOrder', value: String(chosenCategory.displayOrder) }],
    })
      .then(() => {
        modifyCategory(chosenCategory.id, {
          nameValues: [{ name: 'displayOrder', value: String(selectedCategory.displayOrder) }],
        });
      })
      .then(() => {
        if (parentIndex === undefined) {
          changeCategoriesOrder(seq, newSeq);
        } else {
          changeCategoriesSubCategoryOrder(seq, newSeq, parentIndex);
        }
      })
      .catch(() => {
        // dispalyOrder ????????? ??? ?????? ????????????, ?????? ?????? displayOrder??? ?????? api ??????
        modifyCategory(selectedCategory.id, {
          nameValues: [{ name: 'displayOrder', value: String(selectedCategory.displayOrder) }],
        });
        modifyCategory(chosenCategory.id, {
          nameValues: [{ name: 'displayOrder', value: String(chosenCategory.displayOrder) }],
        });
      });
  }

  onClickSaveCategory(category: CategoryModel, index: number, parentIndex?: number) {
    //
    const { registerCategory, changeCategoriesProps, changeCategoriesSubCategoriesProps } =
      this.injected.categoryService;

    registerCategory(CategoryModel.asCdo(category))
      .then((categoryId: string) => {
        if (parentIndex === undefined) {
          changeCategoriesProps(index, 'id', categoryId);
          changeCategoriesProps(index, 'isModify', false);
        } else {
          changeCategoriesSubCategoriesProps(index, 'id', categoryId, parentIndex);
          changeCategoriesSubCategoriesProps(index, 'isModify', false, parentIndex);
        }
      })
      .then(() => {
        alert(AlertModel.getSaveSuccessAlert());
      });
  }

  onClickModifyCategory(category: CategoryModel, index: number, parentIndex?: number) {
    //
    const { modifyCategory, changeCategoriesProps, changeCategoriesSubCategoriesProps } = this.injected.categoryService;

    modifyCategory(category.id, CategoryModel.asModifiedNameValueList(category))
      .then(() => {
        if (parentIndex === undefined) {
          changeCategoriesProps(index, 'isModify', false);
        } else {
          changeCategoriesSubCategoriesProps(index, 'isModify', false, parentIndex);
        }
      })
      .then(() => {
        alert(AlertModel.getSaveSuccessAlert());
      });
  }

  onClickRemoveCategory(categoryId: string) {
    //
    const { removeCategory } = this.injected.categoryService;

    confirm(
      ConfirmModel.getRemoveConfirm(() => {
        removeCategory(categoryId)
          .then(() => {
            alert(AlertModel.getRemoveSuccessAlert());
          })
          .then(() => {
            this.init();
          });
      })
    );
  }

  render() {
    const { categories } = this.injected.categoryService;
    const count = (categories && categories.length) || 0;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.pathForCategory} />
        <Segment className="info-box">
          <List bulleted>
            <List.Item>FAQ ??? Q&A ??? ???????????? ??????????????? ?????? ?????? ??? ??????, ????????? ???????????????.</List.Item>
            <List.Item>???????????? ????????? Front??? ?????? ?????? ??? ?????? ??? ??? ????????????.</List.Item>
            <List.Item>
              ?????????????????? ??????????????? ?????? ??????????????? ??????????????? ?????????????????? ???????????? ?????? ????????? ???????????????.
            </List.Item>
            <List.Item>
              **?????? ????????? ????????? ??????????????? ?????????????????? ???????????? ?????? ?????? ????????? ?????? ??? ??? ????????? ????????? ?????????
              ???????????????.
            </List.Item>
          </List>
        </Segment>
        <Tab.Pane className="category-group">
          <Polyglot languages={ALL_LANGUAGES}>
            <Table celled>
              <colgroup>
                <col width="55%" />
                <col width="15%" />
                <col width="15%" />
                <col width="15%" />
              </colgroup>

              {categories && categories.length > 0 && (
                <>
                  <Table.Header>
                    <Table.Row textAlign="center">
                      <Table.Cell className="title-header">????????????</Table.Cell>
                      <Table.Cell className="title-header">??????/??????</Table.Cell>
                      <Table.Cell className="title-header">?????? ????????????</Table.Cell>
                      <Table.Cell className="title-header">????????????</Table.Cell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {categories.map((category, index) => {
                      const subCount = category.subCategories.length || 0;

                      return (
                        <>
                          <CreateCategoryListView
                            index={index}
                            category={category}
                            count={count}
                            onClickSaveCategory={this.onClickSaveCategory}
                            onClickModify={this.onClickModifyCategory}
                            onClickModifyFrom={this.onClickModifyFrom}
                            onClickAddNewCategory={this.onClickAddCategory}
                            onClickDelete={this.onClickRemoveCategory}
                            changeName={this.changeName}
                            onClickCategoryOrder={this.onClickCategoryOrder}
                          />
                          {category.subCategories &&
                            category.subCategories.length > 0 &&
                            category.subCategories.map((subCategory, subIndex) => (
                              <CreateCategoryListView
                                index={subIndex}
                                parentIndex={index}
                                category={subCategory}
                                count={subCount}
                                onClickSaveCategory={this.onClickSaveCategory}
                                onClickModify={this.onClickModifyCategory}
                                onClickModifyFrom={this.onClickModifyFrom}
                                onClickAddNewCategory={this.onClickAddCategory}
                                onClickDelete={this.onClickRemoveCategory}
                                changeName={this.changeName}
                                onClickCategoryOrder={this.onClickCategoryOrder}
                              />
                            ))}
                        </>
                      );
                    })}
                  </Table.Body>
                </>
              )}
            </Table>
          </Polyglot>
          <Grid>
            <Grid.Column width={16}>
              <div className="center">
                <Button icon basic onClick={() => this.onClickAddCategory()} type="button">
                  ???????????? ??????
                </Button>
              </div>
            </Grid.Column>
          </Grid>
          {/*{newCategories.length > 0 && (*/}
          {/*  <div className="btn-group">*/}
          {/*    <div className="right">*/}
          {/*      <Button primary onClick={this.handleSave} type="button">*/}
          {/*        ??????*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}
        </Tab.Pane>
      </Container>
    );
  }
}

export default withRouter(CreateQnaCategoryContainer);
