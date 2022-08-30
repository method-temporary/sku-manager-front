import { useState, useCallback, useEffect, useRef } from 'react';
import { autorun, toJS } from 'mobx';
import { InputOnChangeData } from 'semantic-ui-react';

import { NameValueList } from 'shared/model';

import Field, { getEmptyField } from '../model/Field';
import CommunityRdo from '../../community/model/CommunityRdo';
import { findAllCommunityByQuery } from '../../community/api/CommunityApi';
import FieldStore from '../mobx/FieldStore';
import FieldOrder from '../model/FieldOrder';
import { fromField } from '../model/FieldCdo';
import { findFields, registerField, modifyField, removeField, saveFieldOrder } from '../api/FieldApi';

interface RequestFieldList {
  (offset?: number): void;
}

interface AddRow {
  (): void;
}

interface DeleteRow {
  (id: string): void;
}

interface UpRow {
  (id: string): void;
}

interface DownRow {
  (id: string): void;
}

interface SaveRow {
  (id: string): void;
}

interface EditRow {
  (id: string): void;
}

interface SaveOrder {
  (): void;
}

interface ExistCommunityRow {
  (id: string): Promise<boolean>;
}

export function useFieldList(): [
  Field[],
  string | undefined,
  AddRow,
  DeleteRow,
  UpRow,
  DownRow,
  SaveRow,
  EditRow,
  SaveOrder,
  (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void,
  ExistCommunityRow
] {
  const fieldStore = FieldStore.instance;
  const [value, setValue] = useState<Field[]>(fieldStore.fieldList);
  const [editedId, setEditedId] = useState<string>();
  const fieldOrderMapRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    requestFieldList();
    return autorun(() => {
      setValue(toJS(fieldStore.fieldList).sort((a, b) => a.order - b.order));
    });
  }, [fieldStore]);

  const requestFieldList = useCallback(() => {
    findFields().then((next) => {
      if (next === undefined) {
        return;
      }
      fieldStore.setFieldList(next);
    });
    setEditedId(undefined);
  }, []);

  const addRow: AddRow = useCallback(() => {
    if (value === undefined) {
      return;
    }
    const maxOrder = value.reduce(
      (r, c) => {
        if (r.order > c.order) {
          return r;
        }
        return c;
      },
      { order: 0 }
    ).order;
    const added = getEmptyField();
    added.order = maxOrder + 1;
    const next = [...value, added];
    fieldStore.setFieldList(next);
    setEditedId(added.id);
    // API 작업
  }, [fieldStore, value]);

  const deleteRow: DeleteRow = useCallback(
    (id: string) => {
      removeField(id).then(requestFieldList);
    },
    [fieldStore, value]
  );

  const upRow: UpRow = useCallback(
    (id: string) => {
      if (value === undefined) {
        return;
      }
      const field = value.find((c) => c.id === id);
      if (field === undefined) {
        return;
      }
      const minOrder = value
        .map((c) => c.order)
        .reduce((r, c) => {
          if (c < r) {
            return c;
          }
          return r;
        }, Number.MAX_VALUE);
      if (field.order === minOrder) {
        return;
      }
      const nextOrder = field.order - 1;
      const nextResults = value.map((c) => {
        if (c.order === nextOrder) {
          fieldOrderMapRef.current.set(c.id, field.order);
          return { ...c, order: field.order };
        }
        if (c.id === field.id) {
          fieldOrderMapRef.current.set(c.id, nextOrder);
          return { ...c, order: nextOrder };
        }
        return c;
      });
      const next = [...nextResults];
      fieldStore.setFieldList(next);
    },
    [fieldStore, value]
  );

  const downRow: DownRow = useCallback(
    (id: string) => {
      if (value === undefined) {
        return;
      }
      const field = value.find((c) => c.id === id);
      if (field === undefined) {
        return;
      }
      const maxOrder = value
        .map((c) => c.order)
        .reduce((r, c) => {
          if (c > r) {
            return c;
          }
          return r;
        }, Number.MIN_VALUE);
      if (field.order === maxOrder) {
        return;
      }
      const nextOrder = field.order + 1;
      const nextResults = value.map((c) => {
        if (c.order === nextOrder) {
          fieldOrderMapRef.current.set(c.id, field.order);
          return { ...c, order: field.order };
        }
        if (c.id === field.id) {
          fieldOrderMapRef.current.set(c.id, nextOrder);
          return { ...c, order: nextOrder };
        }
        return c;
      });
      const next = [...nextResults];
      fieldStore.setFieldList(next);
    },
    [fieldStore, value]
  );

  const saveRow: SaveRow = useCallback(
    (id: string) => {
      if (value === undefined) {
        return;
      }
      const field = value.find((c) => c.id === id);
      if (field === undefined) {
        return;
      }
      if (id === '') {
        registerField(fromField(field)).then(requestFieldList);
      } else {
        const nameValueList = new NameValueList();
        nameValueList.nameValues.push({ name: 'title', value: field.title });
        modifyField(id, nameValueList).then(requestFieldList);
      }
      setEditedId(undefined);
    },
    [fieldStore, value]
  );

  const editRow: EditRow = useCallback((id: string) => {
    setEditedId(id);
  }, []);

  const changeTitle = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
      if (editedId === undefined) {
        return;
      }
      const next = data.value;
      fieldStore.changeTitle(editedId, next);
    },
    [editedId]
  );

  const saveOrder: SaveOrder = useCallback(() => {
    if (value === undefined) {
      return;
    }
    setEditedId(undefined);
    if (fieldOrderMapRef.current.size === 0) {
      return;
    }
    const fieldOrders: FieldOrder[] = [];
    fieldOrderMapRef.current.forEach((order, id) => {
      fieldOrders.push({ id, order });
    });
    fieldOrderMapRef.current.clear();
    saveFieldOrder(fieldOrders).then(requestFieldList);
  }, [fieldStore, value]);

  //const existCommunityRow: (id: string) => boolean = useCallback(
  const existCommunityRow: ExistCommunityRow = useCallback(async (id: string) => {
    const communityRdo: CommunityRdo = {
      field: id,
      searchFilter: '',
      name: '',
      startDate: 0,
      endDate: 9999999999999,
      limit: 0,
      offset: 0,
    };
    let communityCount = 0;
    await findAllCommunityByQuery(communityRdo).then((response) => {
      if (response !== undefined && response.data !== undefined) {
        communityCount = response.data.totalCount;
      }
    });

    if (communityCount > 0) {
      return true;
    } else {
      return false;
    }
  }, []);

  return [
    value,
    editedId,
    addRow,
    deleteRow,
    upRow,
    downRow,
    saveRow,
    editRow,
    saveOrder,
    changeTitle,
    existCommunityRow,
  ];
}
