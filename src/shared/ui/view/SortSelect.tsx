import React from 'react';
import { Select } from 'semantic-ui-react';
import { SortFilterState } from '../../model';
import { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';

interface Props {
  sortFilter: SortFilterState;
  options: { key: string; text: string; value: SortFilterState }[];
  onChange: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
}

const SortSelect = ({ sortFilter, options, onChange }: Props) => {
  //
  return <Select className="small-border m0 sub-actions" value={sortFilter} options={options} onChange={onChange} />;
};

export default SortSelect;
