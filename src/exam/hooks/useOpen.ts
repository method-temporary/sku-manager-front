import { useState, useCallback } from 'react';


export function useOpen(initialState: boolean = false): {
  open: boolean,
  onOpen: (e: React.MouseEvent<HTMLElement>) => void,
  onClose: () => void,
} {
  const [open, setOpen] = useState(initialState);

  const onOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return { open, onOpen, onClose };
}