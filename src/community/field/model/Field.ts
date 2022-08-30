export default interface Field {
  id: string;
  title: string;
  order: number;
}

export function getEmptyField(): Field {
  return { id: '', title: '', order: 0 };
}
