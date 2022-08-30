import { useState, useCallback } from 'react';


export function useFocus(initialState: boolean = false): {
  focus: boolean,
  onClick: (e: React.MouseEvent<HTMLElement>) => void,
  onBlur: (e: React.FocusEvent<HTMLElement>) => void,
} {
  const [focus, setFocus] = useState<boolean>(initialState);

  const onClick = useCallback((e: React.MouseEvent<HTMLElement>): void => {
    setFocus(true);
  }, []);

  const onBlur = useCallback((e: React.FocusEvent<HTMLElement>): void => {
    setFocus(false);
  }, []);

  return { focus, onClick, onBlur };
}