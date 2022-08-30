import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import { patronInfo } from '@nara.platform/dock';

axios.defaults.headers.Pragma = 'no-cache';

setCorrectCineroomId();
ReactDOM.render(<App />, document.getElementById('root'));

export function setCorrectCineroomId() {
  const cinerooms = patronInfo.getCinerooms();
  const mySUNICineroom = cinerooms.find((cineroom) => cineroom.id === 'ne1-m2-c2');
  if (mySUNICineroom) {
    if (
      mySUNICineroom.roles.some((role) => role === 'SuperManager' || role === 'CollegeManager' || role === 'Translator')
    ) {
      patronInfo.setCineroomId('ne1-m2-c2');
      return;
    }
  }
  const companyCineroom = cinerooms.find((cineroom) => cineroom.roles.includes('CompanyManager'));
  if (companyCineroom) {
    patronInfo.setCineroomId(companyCineroom.id);
  }
}
