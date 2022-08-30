import SubActionsContainer from './SubActionsContainer';
import Left from './sub/Left';
import Right from './sub/Right';
import Center from './sub/Center';
import Count from './sub/Count';
import CreateButton from './sub/CreateButton';
import ExcelButton from './sub/ExcelButton';

type SubActionsComp = typeof SubActionsContainer & {
  Left: typeof Left;
  Right: typeof Right;
  Center: typeof Center;
  Count: typeof Count;
  CreateButton: typeof CreateButton;
  ExcelButton: typeof ExcelButton;
};

const SubActions = SubActionsContainer as SubActionsComp;

SubActions.Left = Left;
SubActions.Right = Right;
SubActions.Center = Center;
SubActions.Count = Count;
SubActions.CreateButton = CreateButton;
SubActions.ExcelButton = ExcelButton;

export default SubActions;
