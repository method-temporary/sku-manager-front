export interface SmsModalViewModel {
  isOpen: boolean;
}

export function initSmsModalViewModel(): SmsModalViewModel {
  return {
    isOpen: false,
  };
}
