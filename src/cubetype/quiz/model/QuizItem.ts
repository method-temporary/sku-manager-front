export default interface QuizItem {
  answerItem: boolean;
  img: string;
  number: number;
  text: string;
}

export function getEmptyQuizItem(): QuizItem {
  return {
    answerItem: false,
    img: '',
    number: 0,
    text: ''
  }
}