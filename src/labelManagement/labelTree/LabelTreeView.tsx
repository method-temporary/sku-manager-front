/* eslint-disable react-hooks/exhaustive-deps */
import {
  I18nReSourceModal,
  I18nReSourcePathModal,
} from 'labelManagement/labelManagementModal/LabelManagementModalView';
import React from 'react';
import TreeMenu, { ItemComponent } from 'react-simple-tree-menu';
import { Input, Button } from 'semantic-ui-react';
import { onClickLabel } from './labelTree.events';
import { useRequestLabelTree } from './labelTree.request.servies';
import { useLabelTree } from './labelTree.services';

export function LabelTreeView() {
  useRequestLabelTree();
  const labelTree = useLabelTree();
  if (labelTree === undefined) {
    return null;
  }
  return (
    <div>
      {/* <div>
        <p>* 선택 초기화</p>
        <Button>
          모두 닫기
        </Button>
        <Button>
          모두 열기
        </Button>
      </div> */}
      <div className="m-lnb m-lnb-tree" style={{ border: '0px', height: 'auto' }}>
        <TreeMenu
          cacheSearch
          data={labelTree}
          debounceTime={125}
          onClickItem={onClickLabel}
          openNodes={labelTree.filter((c) => c.isOpen).map((c) => c.key)}
        >
          {({ search, items }) => (
            <>
              <Input
                onChange={(e) => search && search(e.target.value)}
                placeholder="id로 검색해주세요"
                icon="search"
                style={{ width: '100%' }}
              />
              <ul className="menu-tree" style={{ listStyle: 'none', height: '600px' }}>
                {items.map(({ key, hasNodes, level, ...props }) => (
                  <ItemComponent
                    key={key}
                    hasNodes={level === 0}
                    level={level}
                    {...props}
                    // hasNodes={labelTree[]}
                    // onClick={() => onClickLabel(key)}
                    // openedIcon={<Icon name="minus square outline" />}
                    // closedIcon={<Icon name="plus square outline" />}
                    style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                  />
                ))}
              </ul>
            </>
          )}
        </TreeMenu>
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        {/* <Button fluid>화면 등록</Button> */}
        <I18nReSourcePathModal />
        <I18nReSourceModal />
      </div>
      {/* <div style={{ display: 'flex', marginTop: '10px' }}>
        <Button>다운로드</Button>
        <Button>업로드</Button>
        <p>* 템플릿 다운로드</p>
      </div> */}
    </div>
  );
}
