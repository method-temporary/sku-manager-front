import * as React from 'react';
import { useEffect } from 'react';
import {
  setResultManagementViewModel,
} from '../../../../student/store/ResultManagementStore';
import { getEmptyResultManagementViewModel } from '../../../../student/viewModel/ResultManagementViewModel';
import CubeResultManagementContainer from './CubeResultManagementContainer';


export default function CubeResultManagementWrap() {
  useEffect(() => {
    setResultManagementViewModel(getEmptyResultManagementViewModel());
  }, []);

  return (
    <CubeResultManagementContainer />
  );
}
