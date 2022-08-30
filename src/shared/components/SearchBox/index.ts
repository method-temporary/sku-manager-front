import SearchBoxContainer from './SearchBoxContainer';
import { DatePicker, CubeDatePicker } from './sub/DatePicker';
import Group from './sub/Group';
import Input from './sub/Input';
import FieldButton from './sub/FieldButton';
import Select from './sub/Select';
import Query from './sub/Query';
import CheckBox from './sub/CheckBox';

type SearchBoxComp = typeof SearchBoxContainer & {
  DatePicker: typeof DatePicker;
  CubeDatePicker: typeof CubeDatePicker;
  Group: typeof Group;
  Input: typeof Input;
  FieldButton: typeof FieldButton;
  Select: typeof Select;
  Query: typeof Query;
  CheckBox: typeof CheckBox;
};

const SearchBox = SearchBoxContainer as SearchBoxComp;

SearchBox.DatePicker = DatePicker;
SearchBox.CubeDatePicker = CubeDatePicker;
SearchBox.Group = Group;
SearchBox.Input = Input;
SearchBox.FieldButton = FieldButton;
SearchBox.Select = Select;
SearchBox.Query = Query;
SearchBox.CheckBox = CheckBox;

export default SearchBox;

export { default as SearchBoxService } from './logic/SearchBoxService';
export { default as SearchBoxQueryModel } from './model/SearchBoxQueryModel';
