import { useHistory } from 'react-router';
import { isTranslator } from 'lib/common';
import { patronInfo } from '@nara.platform/dock';

const RedirectPage = () => {
  const history = useHistory();
  const cineroomId = patronInfo.getCineroomId();
  if (isTranslator()) {
    history.push(`/cineroom/${cineroomId}/translation-management/cubes/cube-list`);
  } else {
    history.push(`/cineroom/${cineroomId}/learning-management/cubes/cube-list`);
  }
  return null;
};

export default RedirectPage;
