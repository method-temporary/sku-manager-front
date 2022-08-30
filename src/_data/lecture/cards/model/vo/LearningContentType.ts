export type LearningContentType = 'Cube' | 'Chapter' | 'Discussion' | '';

function learningContentsTypeDisplay(type: LearningContentType) {
  //
  if (type === 'Cube') {
    return 'Cube';
  }
  if (type === 'Chapter') {
    return 'Chapter';
  }
  if (type === 'Discussion') {
    return 'Talk';
  }
  return '';
}

export const LearningContentTypeFunc = { learningContentsTypeDisplay };
