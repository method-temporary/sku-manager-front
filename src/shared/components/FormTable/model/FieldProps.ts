import React from 'react';
import { TableCellProps } from 'semantic-ui-react';

export default interface Props {
  children: React.ReactNode | React.ReactNode[];
  name: React.ReactNode;
  nameProps?: TableCellProps;
  valueProps?: TableCellProps;
  required?: boolean;
  subText?: string;
  colSpan?: number;
}
