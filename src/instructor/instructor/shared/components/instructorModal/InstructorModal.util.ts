import InstructorModalStore from './InstructorModal.store';

/**
 * InstructorModal 에서 선택되어 있는지 여부 판단
 * @param instructorId
 */
export const isCheckedInstructor = (instructorId: string) => {
  //
  const { selectedInstructors } = InstructorModalStore.instance;

  return selectedInstructors.some((instructorDetail) => instructorDetail.instructor.id === instructorId);
};
