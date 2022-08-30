import SearchBoxContainer from './SearchBoxContainer';
import { DatePicker } from './sub/DatePicker';
import Group from './sub/Group';
import Input from './sub/Input';
import FieldButton from './sub/FieldButton';
import Select from './sub/Select';
import BasicSearch from './sub/BasicSearch';
import CheckBox from './sub/CheckBox';
import UserGroup from './sub/UserGroup';

type SearchBoxComp = typeof SearchBoxContainer & {
  DatePicker: typeof DatePicker;
  Group: typeof Group;
  Input: typeof Input;
  FieldButton: typeof FieldButton;
  Select: typeof Select;
  BasicSearch: typeof BasicSearch;
  CheckBox: typeof CheckBox;
  UserGroup: typeof UserGroup;
};

const SearchBox = SearchBoxContainer as SearchBoxComp;

SearchBox.DatePicker = DatePicker;
SearchBox.Group = Group;
SearchBox.Input = Input;
SearchBox.FieldButton = FieldButton;
SearchBox.Select = Select;
SearchBox.BasicSearch = BasicSearch;
SearchBox.CheckBox = CheckBox;
SearchBox.UserGroup = UserGroup;

export default SearchBox;

export { default as SearchBoxService } from './logic/TempSearchBoxService';
