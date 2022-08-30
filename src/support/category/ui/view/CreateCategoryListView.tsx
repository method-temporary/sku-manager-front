import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';

import { Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import CategoryModel from '../../model/CategoryModel';

interface Props {
  //
  index: number;
  parentIndex?: number;
  count: number;
  category: CategoryModel;
  onClickSaveCategory: (category: CategoryModel, index: number, parentIndex?: number) => void;
  onClickModify: (category: CategoryModel, index: number, parentIndex?: number) => void;
  onClickModifyFrom: (index: number, id: string, isModify: boolean, parentIndex?: number) => void;
  onClickDelete: (categoryId: string) => void;
  onClickAddNewCategory: (index?: number, parentId?: string) => void;
  changeName: (name: string, value: any, config?: { index: number; parentIndex?: number }) => void;
  onClickCategoryOrder: (seq: number, newSeq: number, parentIndex?: number) => void;
}

@observer
class CreateCategoryListView extends React.Component<Props> {
  //

  render() {
    //
    const {
      index,
      parentIndex,
      category,
      count,
      onClickSaveCategory,
      onClickModify,
      onClickModifyFrom,
      onClickDelete,
      onClickAddNewCategory,
      changeName,
      onClickCategoryOrder,
    } = this.props;

    return (
      <Table.Row key={index} textAlign="center">
        <Table.Cell textAlign="left">
          {category.isModify ? (
            <Polyglot.Input
              name="name"
              languageStrings={category.name}
              onChangeProps={changeName}
              config={{ parentIndex, index }}
              isHorizontal
            />
          ) : (
            `${parentIndex != undefined ? 'ㄴ ' : ''}${getPolyglotToAnyString(category.name)}`
          )}
        </Table.Cell>
        <Table.Cell>
          {category.isModify ? (
            <>
              <Button
                basic
                onClick={() =>
                  category.id
                    ? onClickModify(category, index, parentIndex)
                    : onClickSaveCategory(category, index, parentIndex)
                }
                type="button"
                className="tdBtn"
              >
                저장
              </Button>
              <Button
                basic
                onClick={() => onClickModifyFrom(index, category.id, false, parentIndex)}
                type="button"
                className="tdBtn"
              >
                취소
              </Button>
            </>
          ) : (
            <>
              <Button
                basic
                onClick={() => onClickModifyFrom(index, category.id, true, parentIndex)}
                type="button"
                className="tdBtn"
              >
                수정
              </Button>
              <Button basic onClick={() => onClickDelete(category.id)} type="button" className="tdBtn">
                삭제
              </Button>
            </>
          )}
        </Table.Cell>
        <Table.Cell>
          {!(parentIndex != undefined) && (
            <Button
              basic
              onClick={() => onClickAddNewCategory(index, category.id)}
              type="button"
              className="tbBtn-long"
            >
              세부 카테고리 추가
            </Button>
          )}
        </Table.Cell>
        <Table.Cell>
          <Button
            icon="angle down"
            size="mini"
            basic
            onClick={() => onClickCategoryOrder(index, index + 1, parentIndex)}
            disabled={index === count - 1}
          />
          <Button
            icon="angle up"
            size="mini"
            basic
            onClick={() => onClickCategoryOrder(index, index - 1, parentIndex)}
            disabled={index === 0}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default CreateCategoryListView;
