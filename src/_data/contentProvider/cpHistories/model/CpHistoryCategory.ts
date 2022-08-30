export type CpHistoryCategory = 'CPSTUDENT' | 'CPCONTENT';

export function getCpHistoryCategoryName(category: CpHistoryCategory): string {
  if (category === 'CPSTUDENT') {
    return '학습완료';
  } else if (category === 'CPCONTENT') {
    return '강의정보';
  }
  return '-';
}
