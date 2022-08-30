import React from 'react';
import FieldListView from '../view/FieldListView';
import { useFieldList } from '../../service/useFieldList';

interface FieldListContainerProps { }

const FieldListContainer: React.FC<FieldListContainerProps> = function FieldListContainer() {
  const [fieldList, editedId,
    addRow,
    deleteRow,
    upRow,
    downRow,
    saveRow,
    editRow,
    saveOrder,
    changeTitle,
    existCommunityRow,
  ] = useFieldList();

  return (
    <FieldListView
      results={fieldList}
      empty={fieldList.length === 0}
      addRow={addRow}
      deleteRow={deleteRow}
      upRow={upRow}
      downRow={downRow}
      saveRow={saveRow}
      editRow={editRow}
      saveOrder={saveOrder}
      editedId={editedId}
      changeTitle={changeTitle}
      existCommunityRow={existCommunityRow}
    />
  );
};

export default FieldListContainer;
