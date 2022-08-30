import * as React from 'react';
import { observer } from 'mobx-react';
import TreeMenu, { ItemComponent } from 'react-simple-tree-menu';
import { Icon, Select } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';

import ChartTreeViewModel from '../../model/ChartTreeViewModel';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';

const TREE_ROOT_KEY = 'root';
const TREE_INITIAL_KEY = 'root/category-all';
interface Props {
  arrangeTree?: ChartTreeViewModel[];
  company?: string;
  onChange?: (treeId: string, categoryName: string, categoryId: string) => void;
  badgeCategoryQuery: BadgeCategoryQueryModel;
  userWorkspaceSelect?: SelectTypeModel[];
  onChangeQueryProp: (data: any) => void;
  cineroomId: string;
}

interface State {
  activeCategoryKey: string;
}

@observer
@reactAutobind
class BadgeArrangeTreeSidebar extends ReactComponent<Props, State> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      activeCategoryKey: TREE_INITIAL_KEY,
    };
  }

  onChange(key: string, treeId: string, categoryId: string, categoryName: string) {
    //
    const { onChange } = this.props;

    if (onChange && treeId !== '') {
      this.setState({ activeCategoryKey: key });
      onChange(treeId, categoryName, categoryId);
    }
  }

  render() {
    //
    const { arrangeTree, userWorkspaceSelect, onChangeQueryProp, cineroomId, badgeCategoryQuery } = this.props;
    const { activeCategoryKey } = this.state;

    return (
      <div className="m-lnb m-lnb-tree">
        <TreeMenu
          data={arrangeTree}
          initialActiveKey={TREE_INITIAL_KEY}
          initialOpenNodes={[TREE_ROOT_KEY]}
          activeKey={activeCategoryKey}
          onClickItem={({ key, label, ...props }) => {
            this.onChange(key, props.treeId, props.categoryId, label);
          }}
        >
          {({ items }) => (
            <>
              <ul className="menu-tree">
                {cineroomId === 'ne1-m2-c2' ? (
                  <Select
                    options={userWorkspaceSelect || SelectType.nullState}
                    onChange={(event, data) => onChangeQueryProp(data)}
                    value={badgeCategoryQuery.cineroomId}
                  />
                ) : null}
                {items.map(({ key, ...props }) => (
                  <ItemComponent
                    key={key}
                    {...props}
                    openedIcon={<Icon name="minus square outline" />}
                    closedIcon={<Icon name="plus square outline" />}
                  />
                ))}
              </ul>
            </>
          )}
        </TreeMenu>
      </div>
    );
  }
}

export default BadgeArrangeTreeSidebar;
