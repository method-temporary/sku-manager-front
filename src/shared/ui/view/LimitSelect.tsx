import React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'semantic-ui-react';
import { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';

interface Props {
  limit: number;
  onChange: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
  allViewable?: boolean;
}

const options = [
  { key: '1', text: '20개씩 보기', value: 20 },
  { key: '2', text: '50개씩 보기', value: 50 },
  { key: '3', text: '100개씩 보기', value: 100 },
  { key: '4', text: '전체 보기', value: 9999999 },
];

const LimitSelect = observer(({ limit, onChange, allViewable }: Props) => {
  //
  !allViewable && options.filter(({ value }) => value < 9999999);

  return <Select className="small-border m0 sub-actions" value={limit} options={options} onChange={onChange} />;
});

export default LimitSelect;
