export interface ResultManagementViewModel {
  gradeModalOpen: boolean;
  reportModalOpen: boolean;
  gradeFinished: boolean;
  reportFinished: boolean;
  onOk?: () => void;
}

export function getEmptyResultManagementViewModel(): ResultManagementViewModel {
  return {
    gradeModalOpen: false,
    reportModalOpen: false,
    gradeFinished: false,
    reportFinished: false,
  };
}
