import QuizTableList from "../model/QuizTableList";
import { createStore } from "./Store";


const [
  setQuizTable,
  onQuizTable,
  getQuizTable,
  useQuizTable,
] = createStore<QuizTableList>();

export {
  setQuizTable,
  onQuizTable,
  getQuizTable,
  useQuizTable,
};
