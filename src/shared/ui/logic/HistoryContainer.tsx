import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { setCurrentHistory } from 'shared/store';

export function HistoryContainer() {
  const history = useHistory();

  useEffect(() => {
    setCurrentHistory(history);
  }, [history]);

  return null;
}
